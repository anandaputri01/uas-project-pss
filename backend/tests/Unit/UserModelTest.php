<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created_with_expected_attributes(): void
    {
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $this->assertSame('Admin User', $user->name);
        $this->assertSame('admin@example.com', $user->email);
    }

    public function test_user_password_is_hashed(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'plainpassword',
        ]);

        $this->assertNotEquals('plainpassword', $user->password);
        $this->assertTrue(password_verify('plainpassword', $user->password));
    }

    public function test_user_hides_password_and_remember_token(): void
    {
        $user = User::create([
            'name' => 'Hidden User',
            'email' => 'hidden@example.com',
            'password' => 'password123',
        ]);

        $userArray = $user->toArray();

        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
    }

    public function test_user_implements_jwt_subject(): void
    {
        $user = User::create([
            'name' => 'JWT User',
            'email' => 'jwt@example.com',
            'password' => 'password123',
        ]);

        $this->assertEquals($user->id, $user->getJWTIdentifier());
    }

    public function test_user_jwt_custom_claims_contains_name_and_role(): void
    {
        $user = User::create([
            'name' => 'Custom Claims User',
            'email' => 'claims@example.com',
            'password' => 'password123',
        ]);

        $claims = $user->getJWTCustomClaims();

        $this->assertArrayHasKey('name', $claims);
        $this->assertArrayHasKey('role', $claims);
        $this->assertSame('Custom Claims User', $claims['name']);
        $this->assertSame('admin', $claims['role']);
    }
}
