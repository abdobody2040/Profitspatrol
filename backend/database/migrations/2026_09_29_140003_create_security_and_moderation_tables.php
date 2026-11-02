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
        // 1. Security Events (Prompt injection, unauthorized access, etc.)
        Schema::create('security_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('event_type', 50); // prompt_injection, suspicious_activity, unauthorized_access, data_breach
            $table->string('severity', 20); // critical, high, medium, low
            $table->text('description');
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        // 2. Security Audit Logs
        Schema::create('security_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('action');
            $table->string('target_type')->nullable();
            $table->string('target_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
        });

        // 3. Moderated Content
        Schema::create('moderated_content', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->string('content_type', 30); // chat, project, comment, profile
            $table->text('original_content');
            $table->text('sanitized_content')->nullable();
            $table->json('flags')->nullable();
            $table->string('severity', 20)->nullable(); // critical, high, medium, low
            $table->uuid('reviewed_by')->nullable()->index();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('action_taken', 30)->nullable(); // approved, rejected, edited
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
        });

        // 4. Moderation Whitelist
        Schema::create('moderation_whitelist', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('pattern')->unique();
            $table->string('pattern_type', 20)->default('keyword'); // keyword, regex
            $table->uuid('classroom_id')->nullable()->index();
            $table->uuid('created_by')->nullable()->index();
            $table->timestamps();

            $table->foreign('classroom_id')->references('id')->on('classrooms')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });

        // 5. Moderation Blacklist
        Schema::create('moderation_blacklist', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('pattern')->unique();
            $table->string('pattern_type', 20)->default('keyword'); // keyword, regex
            $table->string('severity', 20)->default('medium'); // critical, high, medium, low
            $table->uuid('created_by')->nullable()->index();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moderation_blacklist');
        Schema::dropIfExists('moderation_whitelist');
        Schema::dropIfExists('moderated_content');
        Schema::dropIfExists('security_audit_logs');
        Schema::dropIfExists('security_events');
    }
};
