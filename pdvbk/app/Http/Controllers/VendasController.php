<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Venda;
use App\Models\Produto;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VendasController extends Controller
{
    public function index()
    {
       
        $vendas = Venda::with('produtos')->orderBy('updated_at', 'desc')->get();

    $data = $vendas->map(function ($venda) {
        // Transformar o pivot em objeto { produto_id: quantidade }
        $quantities = $venda->produtos->pluck('pivot.quantidade', 'id')->toArray();

        return [
            'id' => $venda->id,
            'totalprice' => floatval($venda->totalprice),
            'produtos' => $venda->produtos->map(function ($produto) {
                return [
                    'id' => $produto->id,
                    'nome' => $produto->nome,
                    'preco' => $produto->preco,
                    'imagemUrl' => $produto->imagemUrl,
                    'quantidade' => $produto->quantidade,
                ];
            }),
            'quantities' => $quantities,
            'date' => $venda->date,
        ];
    });

    return response()->json($data);
     
    }

   public function create(Request $request)
    {
        try {
            // 🔹 1. Validação dos campos obrigatórios
            $validated = $request->validate([
                'totalprice'  => 'required|numeric|min:0',
                'date'        => 'required|date',
                'produtos'    => 'required|array|min:1',
                'produtos.*.id' => 'required|integer|exists:produtos,id',
                'quantities'  => 'required|array',
            ]);

            // 🔹 2. Cria a venda
            $venda = Venda::create([
                'totalprice' => $validated['totalprice'],
                'date'       => $validated['date'],
            ]);

            // 🔹 3. Vincula os produtos à venda
            foreach ($validated['produtos'] as $produto) {
                try {
                    $produtoModel = Produto::findOrFail($produto['id']); // garante que existe
                    $quantidade = $validated['quantities'][$produto['id']] ?? 1;

                    $venda->produtos()->attach($produtoModel->id, [
                        'quantidade' => $quantidade
                    ]);
                } catch (ModelNotFoundException $e) {
                    // Se um produto não for encontrado
                    throw ValidationException::withMessages([
                        'produtos' => ["Produto com ID {$produto['id']} não encontrado."]
                    ]);
                }
            }

            // 🔹 4. Retorno
            return response()->json([
                'message' => 'Venda criada com sucesso!',
                'venda'   => $venda->load('produtos')
            ], 201);

        } catch (ValidationException $e) {
            // Retorna erros de validação com status 422
            return response()->json([
                'message' => 'Erro de validação',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Qualquer outro erro inesperado
            return response()->json([
                'message' => 'Erro ao criar venda',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function delete(Request $request, $id)
{
    try {
        // Tenta encontrar o produto
        $venda = Venda::findOrFail($id);

      
        // Deleta o produto
        $venda->delete();

        return response()->json(['message' => 'Venda deletado com sucesso'], 200);

    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Venda não encontrada'], 404);
    } catch (ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erro ao deletar venda'], 500);
    }
}

}
