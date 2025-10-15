<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Produto;

class ProdutoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        $baseUrl = config("app.url") . "/image/";
         Produto::insert([
            [
                'nome' => 'Pão Francês (kg)',
                'preco' => 14.90,
                'imagemUrl' => "$baseUrl/pao.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Pão de Queijo (unidade)',
                'preco' => 2.50,
                'imagemUrl' => "$baseUrl/pao-queijo.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Bolo de Chocolate (fatia)',
                'preco' => 7.00,
                'imagemUrl' => "$baseUrl/bolo-chocolate.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Coxinha de Frango',
                'preco' => 6.00,
                'imagemUrl' => "$baseUrl/coxinha.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Pastel de Carne',
                'preco' => 8.00,
                'imagemUrl' => "$baseUrl/pastel.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Café Expresso',
                'preco' => 4.50,
                'imagemUrl' => "$baseUrl/cafe.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Cappuccino',
                'preco' => 7.00,
                'imagemUrl' => "$baseUrl/cappuccino.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Refrigerante Lata (350ml)',
                'preco' => 6.00,
                'imagemUrl' => "$baseUrl/refrigerante.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Suco Natural (300ml)',
                'preco' => 8.00,
                'imagemUrl' => "$baseUrl/suco.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Água Mineral (500ml)',
                'preco' => 3.50,
                'imagemUrl' => "$baseUrl/agua.webp",
                'quantidade' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
