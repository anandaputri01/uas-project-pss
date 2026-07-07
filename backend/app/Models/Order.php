<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'code',
        'customer_name',
        'phone',
        'service_id',
        'service_name',
        'delivery_id',
        'delivery_name',
        'address',
        'price_base',
        'price_delivery',
        'total_price',
        'status',
    ];

    protected $casts = [
        'price_base' => 'integer',
        'price_delivery' => 'integer',
        'total_price' => 'integer',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at');
    }

    public function addonItems()
    {
        return $this->belongsToMany(Addon::class, 'order_addon')->withPivot('price');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function getAddonsAttribute()
    {
        if (!$this->relationLoaded('addonItems')) {
            return [];
        }
        return $this->addonItems->pluck('slug')->toArray();
    }

    public function getPriceAddonsAttribute()
    {
        if (!$this->relationLoaded('addonItems')) {
            return 0;
        }
        return $this->addonItems->sum('pivot.price');
    }
}
