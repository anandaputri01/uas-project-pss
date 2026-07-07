<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('customer_name');
            $table->string('phone');
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->string('service_name');
            $table->json('addons')->nullable();
            $table->string('delivery_id');
            $table->string('delivery_name');
            $table->text('address')->nullable();
            $table->unsignedInteger('price_base');
            $table->unsignedInteger('price_addons')->default(0);
            $table->unsignedInteger('price_delivery')->default(0);
            $table->unsignedInteger('total_price');
            $table->string('status')->default('Diterima');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
