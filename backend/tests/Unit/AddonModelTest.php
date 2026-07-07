<?php

namespace Tests\Unit;

use App\Models\Addon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddonModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_addon_can_be_created_with_expected_attributes(): void
    {
        $addon = Addon::create([
            'slug' => 'parfum-premium',
            'name' => 'Parfum Premium',
            'price' => 15000,
        ]);

        $this->assertSame('parfum-premium', $addon->slug);
        $this->assertSame('Parfum Premium', $addon->name);
        $this->assertSame(15000, $addon->price);
    }

    public function test_addon_price_is_integer(): void
    {
        $addon = Addon::create([
            'slug' => 'vacuum-interior',
            'name' => 'Vacuum Interior',
            'price' => 20000,
        ]);

        $this->assertIsInt($addon->price);
    }
}
