<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Venda;
use App\Models\Produto;
use Carbon\Carbon;

class VendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        $produtos = Produto::all();

        $startDate = Carbon::create(2025, 1, 1);
        $endDate   = Carbon::create(2025, 9, 30);

        while ($startDate->lte($endDate)) {
            // Meta de faturamento diário aproximada (~350)
            $dailyTarget = rand(320, 380);
            $dailyTotal = 0;

            while ($dailyTotal < $dailyTarget) {
                // Criar venda com hora aleatória
                $venda = Venda::create([
                    'totalprice' => 0,
                    'date' => $startDate->copy()->setTime(rand(6, 20), rand(0, 59)),
                ]);

                // Seleciona 1 a 3 produtos aleatórios
                $produtosSelecionados = $produtos->random(rand(1, 3));

                $valorVenda = 0;
                $attachData = [];

                foreach ($produtosSelecionados as $produto) {
                    $qtd = rand(1, 5);
                    $valorVenda += $produto->preco * $qtd;
                    $attachData[$produto->id] = ['quantidade' => $qtd];
                }

                // Atualiza valor total da venda
                $venda->update(['totalprice' => $valorVenda]);

                // Associa produtos à venda
                $venda->produtos()->attach($attachData);

                $dailyTotal += $valorVenda;
            }

            // Próximo dia
            $startDate->addDay();
        }
    }
}
