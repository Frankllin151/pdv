<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Gasto;
use GuzzleHttp\Psr7\Request;

class GastoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
 
        public function run(): void
    {
        Gasto::insert([
            [
                'nome' => 'Aluguel da Loja',
                'valor' => 900.00,
                'fixo' => 'fixo',
                'date' => '2025-01-01 00:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Conta de Luz',
                'valor' => 350.00,
                'fixo' => 'fixo',
                'date' => '2025-01-05 00:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Farinha',
                'valor' => 3000.00,
                'fixo' => "fixo",
                'date' => '2025-06-10 00:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }


   
    
}
