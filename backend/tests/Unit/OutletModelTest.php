<?php

namespace Tests\Unit;

use App\Models\Outlet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OutletModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_outlet_can_be_created_with_expected_attributes(): void
    {
        $outlet = Outlet::create([
            'name' => 'Outlet Sudirman',
            'address' => 'Jl. Sudirman No. 123',
            'lat' => -6.2088,
            'lng' => 106.8456,
        ]);

        $this->assertSame('Outlet Sudirman', $outlet->name);
        $this->assertSame('Jl. Sudirman No. 123', $outlet->address);
    }

    public function test_outlet_coordinates_are_cast_to_float(): void
    {
        $outlet = Outlet::create([
            'name' => 'Outlet Kemang',
            'address' => 'Jl. Kemang Raya No. 45',
            'lat' => -6.2608,
            'lng' => 106.8267,
        ]);

        $this->assertIsFloat($outlet->lat);
        $this->assertIsFloat($outlet->lng);
        $this->assertEquals(-6.2608, $outlet->lat, '', 0.0001);
        $this->assertEquals(106.8267, $outlet->lng, '', 0.0001);
    }
}
