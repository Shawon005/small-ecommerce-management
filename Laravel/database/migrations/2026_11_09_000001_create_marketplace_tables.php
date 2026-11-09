<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->string('role')->default('owner'));
        Schema::create('shops', function (Blueprint $t) {
            $t->id();
            $t->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $t->string('name');
            $t->string('slug')->unique();
            $t->text('description')->nullable();
            $t->boolean('is_active')->default(true);
            $t->timestamps();
        });
        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('name');
            $t->string('sku')->unique();
            $t->string('category');
            $t->text('description');
            $t->decimal('price', 12, 2);
            $t->string('thumbnail', 2048)->nullable();
            $t->timestamps();
        });
        Schema::create('listings', function (Blueprint $t) {
            $t->id();
            $t->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->text('description');
            $t->decimal('price', 12, 2);
            $t->string('thumbnail', 2048)->nullable();
            $t->boolean('is_active')->default(true);
            $t->unique(['shop_id', 'product_id']);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
        Schema::dropIfExists('products');
        Schema::dropIfExists('shops');
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn('role'));
    }
};
