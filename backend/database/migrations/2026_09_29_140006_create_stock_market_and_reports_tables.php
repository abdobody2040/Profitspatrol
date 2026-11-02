<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Stock Companies Catalog
        Schema::create('stock_companies', function (Blueprint $table) {
            $table->string('id', 64)->primary(); // e.g. ollie_robotics
            $table->string('name');
            $table->string('sector', 50)->nullable(); // Tech, Retail, Logistics, Energy, Finance
            $table->text('description')->nullable();
            $table->string('emoji', 16)->default('📈');
            $table->integer('current_price')->default(100);
            $table->json('price_history')->nullable();
            $table->timestamps();
        });

        // 2. User Stock Portfolios
        Schema::create('stock_portfolio', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->string('stock_id', 64)->index();
            $table->integer('quantity')->default(0);
            $table->integer('avg_buy_price')->nullable();
            $table->timestamp('last_updated')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'stock_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('stock_id')->references('id')->on('stock_companies')->onDelete('cascade');
        });

        // 3. Parent Report Log
        Schema::create('parent_report_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->index();
            $table->uuid('kid_id')->index();
            $table->timestamp('sent_at')->useCurrent();
            $table->string('month', 10); // e.g. 2026-03
            $table->string('email_status', 20)->default('sent'); // sent, failed
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kid_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_report_log');
        Schema::dropIfExists('stock_portfolio');
        Schema::dropIfExists('stock_companies');
    }
};
