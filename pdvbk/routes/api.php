<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GastosController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\VendasController;

Route::get("/ping", function (){
return  ["ping"  => "pong"];
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
});

// Vendas
Route::middleware('auth:sanctum')->group(function(){
   Route::get("/vendas", [VendasController::class, "index"]);
   Route::post("/vendas/post", [VendasController::class,"create"]);
   Route::post("/venda/delete/{id}", [VendasController::class, "delete"]);
   
});
// Gastos 
Route::middleware('auth:sanctum')->group(function(){
   Route::get("/gastos", [GastosController::class, "index"]);
   Route::post("/gasto/post", [GastosController::class,"create"]);
   Route::post("/gasto/put/{id}", [GastosController::class, "update"]);
   Route::post("/gasto/delete/{id}", [GastosController::class, "delete"]);
});

// produto 
Route::middleware('auth:sanctum')->group(function(){
   Route::get("/produtos", [ProdutoController::class,"index"]);
   Route::post("/produto/post", [ProdutoController::class,"create"]);
   Route::post("/produto/{id}/put", [ProdutoController::class,"update"]);
   Route::post('/produto/{id}/delete', [ProdutoController::class, 'delete']);
});


////3|muQxrynX9w9Tcit0VhXQsb46u5O64Cxxw5ROq4FG5b6d7518