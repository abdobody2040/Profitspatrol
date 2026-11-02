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
        Schema::create('bounties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('reward');
            $table->string('status', 30)->default('OPEN'); // OPEN, CLAIMED, IN_PROGRESS, PENDING_APPROVAL, COMPLETED, CANCELLED
            $table->uuid('claimed_by')->nullable()->index();
            $table->timestamp('claimed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('claimed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bounties');
    }
};
