<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class GastosController extends Controller
{
  public function index()
  {
     $gastos = Gasto::orderBy('updated_at', 'desc')->get()->map(function ($gasto) {
        return [
            'id' => $gasto->id,
            'nome' => $gasto->nome,
            'valor' => $gasto->valor,
            'fixo' => $gasto->fixo,
            'date' => $gasto->date,
        ];
    });

    return response()->json($gastos);
  }


  public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'valor' => 'required|numeric|min:0',
                'fixo' => 'nullable|string|max:50',
            ]);

            $gasto = Gasto::create($validated);

            return response()->json($gasto, 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao criar gasto'], 500);
        }
    }

   public function update(Request $request, $id)
    {
        try {
            $gasto = Gasto::findOrFail($id);

            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'valor' => 'required|numeric|min:0',
                'fixo' => 'nullable|string|max:50',
            ]);

            $gasto->update($validated);

            return response()->json($gasto, 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Gasto não encontrado'], 404);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar gasto'], 500);
        }
    }


    public function delete($id)
    {
        try {
            $gasto = Gasto::findOrFail($id);
            $gasto->delete();
            return response()->json(['message' => 'Gasto deletado com sucesso'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Gasto não encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao deletar gasto'], 500);
        }
    }
}
