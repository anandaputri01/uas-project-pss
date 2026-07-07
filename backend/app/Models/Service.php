<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'price',
        'description',
        'features',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'integer',
    ];
}
