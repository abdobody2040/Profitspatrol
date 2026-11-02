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
        // 1. Classrooms
        Schema::create('classrooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code', 32)->unique();
            $table->uuid('teacher_id')->index();
            $table->json('locked_modules')->nullable();
            $table->timestamps();

            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 2. Classroom Members
        Schema::create('classroom_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('classroom_id')->index();
            $table->uuid('user_id')->index();
            $table->string('role', 20)->default('student'); // teacher, student
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();

            $table->unique(['classroom_id', 'user_id']);
            $table->foreign('classroom_id')->references('id')->on('classrooms')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 3. Student Groups
        Schema::create('student_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('classroom_id')->index();
            $table->string('name');
            $table->json('student_ids')->nullable();
            $table->string('color', 50)->nullable();
            $table->timestamps();

            $table->foreign('classroom_id')->references('id')->on('classrooms')->onDelete('cascade');
        });

        // 4. Rubrics
        Schema::create('rubrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('teacher_id')->index();
            $table->string('title');
            $table->json('criteria');
            $table->timestamps();

            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 5. Assignments
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('classroom_id')->index();
            $table->string('lesson_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->uuid('student_group_id')->nullable()->index();
            $table->json('specific_student_ids')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->uuid('rubric_id')->nullable()->index();
            $table->integer('max_points')->default(100);
            $table->string('resource_url')->nullable();
            $table->string('status', 20)->default('DRAFT'); // DRAFT, PUBLISHED, ARCHIVED, SCHEDULED
            $table->timestamps();

            $table->foreign('classroom_id')->references('id')->on('classrooms')->onDelete('cascade');
            $table->foreign('student_group_id')->references('id')->on('student_groups')->onDelete('set null');
            $table->foreign('rubric_id')->references('id')->on('rubrics')->onDelete('set null');
        });

        // 6. Submissions
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('assignment_id')->index();
            $table->uuid('student_id')->index();
            $table->text('content')->nullable();
            $table->string('file_url')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->string('status', 20)->default('PENDING'); // PENDING, GRADED, LATE
            $table->decimal('grade', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->uuid('graded_by')->nullable()->index();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(['assignment_id', 'student_id']);
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('graded_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('rubrics');
        Schema::dropIfExists('student_groups');
        Schema::dropIfExists('classroom_members');
        Schema::dropIfExists('classrooms');
    }
};
