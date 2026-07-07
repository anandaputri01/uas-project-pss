<?php

namespace Tests\Unit;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_service_can_be_created_with_expected_attributes(): void
    {
        $service = Service::create([
            'slug' => 'basic',
            'name' => 'Paket Basic',
            'price' => 25000,
            'description' => 'Cuci cepat dan bersih',
            'features' => ['Cuci luar', 'Cuci dalam'],
        ]);

        $this->assertSame('basic', $service->slug);
        $this->assertSame('Paket Basic', $service->name);
        $this->assertSame(25000, $service->price);
        $this->assertSame('Cuci cepat dan bersih', $service->description);
        $this->assertIsArray($service->features);
        $this->assertContains('Cuci luar', $service->features);
    }

    public function test_service_features_are_cast_to_array(): void
    {
        $service = Service::create([
            'slug' => 'premium',
            'name' => 'Paket Premium',
            'price' => 50000,
            'description' => 'Cuci premium',
            'features' => ['Cuci luar', 'Cuci dalam', 'Vacuum'],
        ]);

        $this->assertIsArray($service->features);
        $this->assertCount(3, $service->features);
    }

    public function test_service_price_is_cast_to_integer(): void
    {
        $service = Service::create([
            'slug' => 'express',
            'name' => 'Paket Express',
            'price' => 35000,
            'description' => 'Cuci kilat',
            'features' => ['Cuci luar'],
        ]);

        $this->assertIsInt($service->price);
    }
}
