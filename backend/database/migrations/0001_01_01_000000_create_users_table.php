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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Basic Info & Identity
            $table->string('name');
            $table->string('username')->unique()->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('google_id')->unique()->nullable();
            $table->string('password');
            $table->string('role', 20)->default('kid')->index(); // kid, parent, teacher, admin
            $table->unsignedInteger('age')->nullable();
            $table->string('avatar')->nullable();

            // Family & Referrals
            $table->uuid('parent_id')->nullable()->index();
            $table->string('invite_code', 32)->unique()->nullable();
            $table->uuid('referred_by')->nullable();
            $table->unsignedInteger('total_referrals')->default(0);

            // Progression & Gamification
            $table->integer('xp')->default(0);
            $table->integer('season_xp')->default(0);
            $table->integer('level')->default(1);
            $table->integer('pp_tokens')->default(100);
            $table->integer('streak')->default(1);
            $table->date('last_activity_date')->nullable();
            $table->boolean('streak_shield')->default(false);
            $table->date('streak_shield_used_date')->nullable();
            $table->date('streak_last_bonus_date')->nullable();

            // Education & Map State
            $table->string('current_module_id')->default('mod_1');
            $table->json('completed_lesson_ids')->nullable();
            $table->json('read_book_ids')->nullable();
            $table->json('completed_book_tasks')->nullable();
            $table->integer('book_task_streak')->default(0);
            $table->date('last_book_task_date')->nullable();
            $table->json('badges')->nullable();

            // Customization & HQ
            $table->json('inventory')->nullable();
            $table->json('equipped_items')->nullable();
            $table->json('placed_items')->nullable();
            $table->json('business_logo')->nullable();
            $table->string('hq_level')->default('hq_garage');
            $table->string('hq_theme')->default('blue');
            $table->json('unlocked_skills')->nullable();

            // Portfolio, Real Estate & Venture
            $table->json('portfolio')->nullable();
            $table->json('properties')->nullable();

            // Subscription & Energy
            $table->string('subscription_status', 20)->default('FREE'); // FREE, PREMIUM
            $table->string('subscription_tier', 50)->default('intern'); // intern, founder, board, tycoon, classroom, etc.
            $table->string('billing_cycle', 20)->nullable(); // MONTHLY, YEARLY
            $table->string('stripe_customer_id')->unique()->nullable();
            $table->string('stripe_subscription_id')->unique()->nullable();
            $table->unsignedSmallInteger('energy')->default(5);
            $table->bigInteger('last_energy_refill')->nullable();

            // User Settings
            $table->json('settings')->nullable();

            // Engagement & Seasonal Features
            $table->boolean('has_graduated')->default(false);
            $table->date('last_spin_date')->nullable();
            $table->unsignedInteger('total_spins')->default(0);
            $table->json('weekly_challenges')->nullable();
            $table->json('biz_pulse_read')->nullable();
            $table->json('completed_seasonal_challenges')->nullable();
            $table->unsignedInteger('lessons_completed')->default(0);
            $table->unsignedInteger('gigs_completed')->default(0);
            $table->unsignedInteger('streak_days')->default(0);
            $table->string('top_achievement')->default('Completed first lesson!');
            $table->boolean('monthly_report_enabled')->default(true);

            // Compliance, Security & Parental Gate
            $table->unsignedInteger('parental_gate_attempts')->default(0);
            $table->timestamp('parental_gate_locked_until')->nullable();
            $table->timestamp('parental_gate_passed_at')->nullable();
            $table->timestamp('deletion_requested_at')->nullable();
            $table->timestamp('deletion_scheduled_for')->nullable();
            $table->timestamp('deletion_cancelled_at')->nullable();

            // Laravel Auth Standard Columns
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // Foreign key self-reference
            $table->foreign('parent_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id', 36)->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
