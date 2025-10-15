<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'valor',
        'fixo',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}
