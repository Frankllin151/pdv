<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produto;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProdutoController extends Controller
{
    public function index() {
        $produtos = Produto::orderBy('updated_at', 'desc')->get(); 

          return response()->json($produtos);
    }

    public function create(Request $request)
    {
      // Validação
    $request->validate([
        'nome' => 'required|string|max:255',
        'preco' => 'required|numeric|min:0',
        'quantidade' => 'nullable|integer|min:0',
        'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // imagem opcional, máximo 2MB
    ]);

    $produto = new Produto();
    $produto->nome = $request->input('nome');
    $produto->preco = $request->input('preco');
    $produto->quantidade = $request->input('quantidade', 0);

    if ($request->hasFile('imagem')) {
        $file = $request->file('imagem');
        $filename = time() . '_' . $file->getClientOriginalName();

        // Cria a pasta public/image se não existir
        if (!file_exists(public_path('image'))) {
            mkdir(public_path('image'), 0755, true);
        }

        $file->move(public_path('image'), $filename);
        $produto->imagemUrl = config("app.url").'/image/' . $filename;
    }

    $produto->save();

    return response()->json($produto, 201);
    }

public function update(Request $request, $id)
{
  
    try {
        // Tenta encontrar o produto
        $produto = Produto::findOrFail($id);

        // Validação dos dados
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'quantidade' => 'nullable|integer|min:0',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Atualiza os campos
        $produto->nome = $validated['nome'];
        $produto->preco = $validated['preco'];
        $produto->quantidade = $validated['quantidade'] ?? $produto->quantidade;

        // Atualiza a imagem, se fornecida
        if ($request->hasFile('imagem')) {
            $file = $request->file('imagem');
            $filename = time() . '_' . $file->getClientOriginalName();

            // Cria a pasta public/image se não existir
            if (!file_exists(public_path('image'))) {
                mkdir(public_path('image'), 0755, true);
            }

            $file->move(public_path('image'), $filename);
            $produto->imagemUrl = config("app.url").'/image/' . $filename;
        }

        $produto->save();

        return response()->json($produto, 200);

    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Produto não encontrado'], 404);
    } catch (ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erro ao atualizar o produto'], 500);
    }
}


public function delete(Request $request, $id)
{
    try {
        // Tenta encontrar o produto
        $produto = Produto::findOrFail($id);

        // Se tiver uma imagem associada, remove do servidor
        if ($produto->imagemUrl) {
            $imagePath = public_path($produto->imagemUrl);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Deleta o produto
        $produto->delete();

        return response()->json(['message' => 'Produto deletado com sucesso'], 200);

    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Produto não encontrado'], 404);
    } catch (ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Erro ao deletar o produto'], 500);
    }
}

}
