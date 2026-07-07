<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->code,
            'customerName' => $this->customer_name,
            'phone' => $this->phone,
            'serviceId' => $this->service?->slug,
            'serviceName' => $this->service_name,
            'addons' => $this->addons ?? [],
            'deliveryId' => $this->delivery_id,
            'deliveryName' => $this->delivery_name,
            'address' => $this->address,
            'priceBase' => $this->price_base,
            'priceAddons' => $this->price_addons,
            'priceDelivery' => $this->price_delivery,
            'totalPrice' => $this->total_price,
            'status' => $this->status,
            'date' => $this->created_at?->toISOString(),
            'payment' => $this->whenLoaded('payment', fn () => [
                'method' => $this->payment->method,
                'status' => $this->payment->status,
            ]),
            'history' => $this->whenLoaded('histories', fn () => $this->histories->map(fn ($h) => [
                'status' => $h->status,
                'date' => $h->created_at?->toISOString(),
            ])),
        ];
    }
}
