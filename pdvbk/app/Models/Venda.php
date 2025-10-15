<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venda extends Model
{
    use HasFactory;

    protected $fillable = [
        'totalprice',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'produto_venda')
                    ->withPivot('quantidade')
                    ->withTimestamps();
    }
}
