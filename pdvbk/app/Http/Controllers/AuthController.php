<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AuthController extends Controller
{
    // Registrar usuário
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // Login
public function login(Request $request)
{
    try {
        // Validação do request
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Busca do usuário (com exception se não encontrado)
        $user = User::where('email', $request->email)->firstOrFail();

        // Verifica senha
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        // Cria token
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'token' => $token,
        ]);

    } catch (ValidationException $e) {
        // Retorna erros de validação
        return response()->json([
            'message' => 'Erro de validação',
            'errors' => $e->errors()
        ], 422);

    } catch (ModelNotFoundException $e) {
        // Usuário não encontrado
        return response()->json(['message' => 'Usuário não encontrado'], 404);

    } catch (\Exception $e) {
        // Qualquer outro erro
        return response()->json(['message' => 'Erro interno do servidor'], 500);
    }
}

    // Logout
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso']);
    }
}
