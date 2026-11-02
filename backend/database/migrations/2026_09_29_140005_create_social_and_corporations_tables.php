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
        // 1. Friendships / Social
        Schema::create('friends', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->uuid('friend_id')->index();
            $table->string('status', 20)->default('PENDING'); // PENDING, ACCEPTED, BLOCKED
            $table->timestamps();

            $table->unique(['user_id', 'friend_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('friend_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 2. Corporations (Guilds)
        Schema::create('corporations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('code', 32)->unique();
            $table->string('logo_icon')->default('building');
            $table->string('logo_emoji', 16)->default('🏢');
            $table->string('logo_color', 32)->default('#6366f1');
            $table->string('motto')->default('Building the future together');
            $table->uuid('founder_id')->nullable()->index();
            $table->integer('corp_xp')->default(0);
            $table->timestamps();

            $table->foreign('founder_id')->references('id')->on('users')->onDelete('set null');
        });

        // 3. Corporation Members
        Schema::create('corporation_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('corporation_id')->index();
            $table->uuid('user_id')->unique(); // one corp per user at a time
            $table->string('role', 20)->default('Member'); // CEO, COO, Member
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();

            $table->foreign('corporation_id')->references('id')->on('corporations')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('corporation_members');
        Schema::dropIfExists('corporations');
        Schema::dropIfExists('friends');
    }
};
