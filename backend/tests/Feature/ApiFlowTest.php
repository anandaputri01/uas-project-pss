<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_services_endpoint_returns_seeded_services(): void
    {
        Service::create([
            'slug' => 'basic',
            'name' => 'Paket Basic',
            'price' => 25000,
            'description' => 'Cuci cepat',
            'features' => ['Cuci luar'],
        ]);

        $response = $this->getJson('/api/services');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'price', 'desc', 'features'],
                ],
            ]);
    }

    public function test_order_creation_endpoint_returns_created_order(): void
    {
        Service::create([
            'slug' => 'basic',
            'name' => 'Paket Basic',
            'price' => 25000,
            'description' => 'Cuci cepat',
            'features' => ['Cuci luar'],
        ]);

        $response = $this->postJson('/api/orders', [
            'customerName' => 'Budi',
            'phone' => '08123456789',
            'serviceId' => 'basic',
            'addons' => ['antijamur'],
            'deliveryId' => 'pickup',
            'address' => 'Jl. Melati',
            'priceBase' => 25000,
            'priceAddons' => 5000,
            'priceDelivery' => 10000,
            'totalPrice' => 40000,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'order' => ['id', 'customerName', 'serviceId', 'status'],
            ]);

        $this->assertDatabaseHas('orders', ['customer_name' => 'Budi']);
    }
}
