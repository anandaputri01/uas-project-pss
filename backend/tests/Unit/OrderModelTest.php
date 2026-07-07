<?php

namespace Tests\Unit;

use App\Models\Addon;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_can_be_created_with_expected_attributes(): void
    {
        $order = Order::create([
            'code' => 'ORD-001',
            'customer_name' => 'Budi Santoso',
            'phone' => '08123456789',
            'service_name' => 'Paket Basic',
            'delivery_id' => 'pickup',
            'delivery_name' => 'Pick-up & Delivery',
            'price_base' => 25000,
            'price_delivery' => 10000,
            'total_price' => 35000,
            'status' => 'Diterima',
        ]);

        $this->assertSame('ORD-001', $order->code);
        $this->assertSame('Budi Santoso', $order->customer_name);
        $this->assertSame('Diterima', $order->status);
    }

    public function test_order_price_fields_are_cast_to_integer(): void
    {
        $order = Order::create([
            'code' => 'ORD-002',
            'customer_name' => 'Ani Wijaya',
            'phone' => '08198765432',
            'service_name' => 'Paket Premium',
            'delivery_id' => 'pickup',
            'delivery_name' => 'Pick-up & Delivery',
            'price_base' => 50000,
            'price_delivery' => 15000,
            'total_price' => 65000,
            'status' => 'Diproses',
        ]);

        $this->assertIsInt($order->price_base);
        $this->assertIsInt($order->price_delivery);
        $this->assertIsInt($order->total_price);
    }

    public function test_order_belongs_to_service(): void
    {
        $service = Service::create([
            'slug' => 'basic',
            'name' => 'Paket Basic',
            'price' => 25000,
        ]);

        $order = Order::create([
            'code' => 'ORD-003',
            'customer_name' => 'Test User',
            'phone' => '081234567890',
            'service_id' => $service->id,
            'service_name' => 'Paket Basic',
            'delivery_id' => 'pickup',
            'delivery_name' => 'Pick-up & Delivery',
            'price_base' => 25000,
            'total_price' => 25000,
            'status' => 'Diterima',
        ]);

        $this->assertEquals($service->id, $order->service->id);
        $this->assertEquals('Paket Basic', $order->service->name);
    }

    public function test_order_addons_accessor_returns_empty_array_when_not_loaded(): void
    {
        $order = Order::create([
            'code' => 'ORD-004',
            'customer_name' => 'Test User',
            'phone' => '081234567890',
            'service_name' => 'Paket Basic',
            'delivery_id' => 'pickup',
            'delivery_name' => 'Pick-up & Delivery',
            'price_base' => 25000,
            'total_price' => 25000,
            'status' => 'Diterima',
        ]);

        $this->assertSame([], $order->addons);
    }

    public function test_order_price_addons_accessor_returns_zero_when_not_loaded(): void
    {
        $order = Order::create([
            'code' => 'ORD-005',
            'customer_name' => 'Test User',
            'phone' => '081234567890',
            'service_name' => 'Paket Basic',
            'delivery_id' => 'pickup',
            'delivery_name' => 'Pick-up & Delivery',
            'price_base' => 25000,
            'total_price' => 25000,
            'status' => 'Diterima',
        ]);

        $this->assertSame(0, $order->price_addons);
    }
}
