<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthMiddlewareTest extends TestCase
{
    public function test_me_requires_authentication_and_returns_json_401(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }
}
