<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Produto;
use App\Models\Venda;
use App\Models\Gasto;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         

        // Rodar apenas os seeders que você quiser
        $this->call([
           VendaSeeder::class
           
        ]);
        
    }
}
