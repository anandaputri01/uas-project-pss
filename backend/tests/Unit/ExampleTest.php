<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_service_model_can_be_created_with_expected_attributes(): void
    {
        $service = Service::create([
            'slug' => 'basic',
            'name' => 'Paket Basic',
            'price' => 25000,
            'description' => 'Cuci cepat',
            'features' => ['Cuci luar'],
        ]);

        $this->assertSame('basic', $service->slug);
        $this->assertSame('Paket Basic', $service->name);
        $this->assertSame(25000, $service->price);
    }

    public function test_order_model_can_store_price_values(): void
    {
        $order = new Order([
            'code' => 'ORD-001',
            'customer_name' => 'Budi',
            'phone' => '08123456789',
            'service_name' => 'Paket Basic',
            'delivery_id' => 'pickup',
            'delivery_name' => 'Pick-up & Delivery',
            'price_base' => 25000,
            'price_addons' => 5000,
            'price_delivery' => 10000,
            'total_price' => 40000,
            'status' => 'Diterima',
        ]);

        $this->assertSame(40000, $order->total_price);
        $this->assertSame('Diterima', $order->status);
    }
}
