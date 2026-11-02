<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\ClassroomMember;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClassroomController extends Controller
{
    /**
     * Get user classrooms.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || $user->role === 'admin') {
            $classrooms = Classroom::with(['members.user', 'assignments'])->get();
        } elseif ($user->role === 'teacher') {
            $classrooms = Classroom::with(['members.user', 'assignments'])
                ->where('teacher_id', $user->id)
                ->get();
        } else {
            $classrooms = $user->classroomsEnrolled()
                ->with(['teacher', 'assignments'])
                ->get();
        }

        return response()->json([
            'success' => true,
            'classrooms' => $classrooms,
        ]);
    }

    /**
     * Teacher creates a new classroom.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'teacher' && !$user->isAdmin()) {
            return response()->json(['error' => 'Only teachers can create classrooms.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'locked_modules' => 'nullable|array',
        ]);

        $code = strtoupper(Str::random(6));
        while (Classroom::where('code', $code)->exists()) {
            $code = strtoupper(Str::random(6));
        }

        $classroom = Classroom::create([
            'name' => $validated['name'],
            'code' => $code,
            'teacher_id' => $user->id,
            'locked_modules' => $validated['locked_modules'] ?? [],
        ]);

        // Add teacher as member
        ClassroomMember::create([
            'classroom_id' => $classroom->id,
            'user_id' => $user->id,
            'role' => 'teacher',
        ]);

        return response()->json([
            'success' => true,
            'classroom' => $classroom->load('teacher'),
        ], 201);
    }

    /**
     * Student joins classroom with code.
     */
    public function join(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10',
        ]);

        $code = strtoupper(trim($validated['code']));
        $classroom = Classroom::where('code', $code)->first();

        if (!$classroom) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid classroom code. Please check and try again.',
            ], 404);
        }

        $user = $request->user();
        $existing = ClassroomMember::where('classroom_id', $classroom->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Already enrolled in this classroom.',
                'classroom' => $classroom->load('teacher'),
            ]);
        }

        ClassroomMember::create([
            'classroom_id' => $classroom->id,
            'user_id' => $user->id,
            'role' => 'student',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully joined classroom!',
            'classroom' => $classroom->load('teacher'),
        ]);
    }

    /**
     * Get specific classroom details.
     */
    public function show(string $id, Request $request): JsonResponse
    {
        $classroom = Classroom::with(['teacher', 'members.user', 'assignments.submissions'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'classroom' => $classroom,
        ]);
    }

    /**
     * Teacher creates assignment in classroom.
     */
    public function storeAssignment(string $classroomId, Request $request): JsonResponse
    {
        $user = $request->user();
        $classroom = Classroom::findOrFail($classroomId);

        if ($classroom->teacher_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'lesson_id' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'max_points' => 'nullable|integer|min:1',
            'resource_url' => 'nullable|string',
            'status' => 'nullable|string|in:DRAFT,PUBLISHED,ARCHIVED,SCHEDULED',
        ]);

        $assignment = Assignment::create([
            'classroom_id' => $classroom->id,
            'lesson_id' => $validated['lesson_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'max_points' => $validated['max_points'] ?? 100,
            'resource_url' => $validated['resource_url'] ?? null,
            'status' => $validated['status'] ?? 'PUBLISHED',
        ]);

        return response()->json([
            'success' => true,
            'assignment' => $assignment,
        ], 201);
    }

    /**
     * Student submits assignment.
     */
    public function submitAssignment(string $assignmentId, Request $request): JsonResponse
    {
        $user = $request->user();
        $assignment = Assignment::findOrFail($assignmentId);

        $validated = $request->validate([
            'content' => 'nullable|string',
            'file_url' => 'nullable|string',
        ]);

        $submission = Submission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'student_id' => $user->id,
            ],
            [
                'content' => $validated['content'] ?? null,
                'file_url' => $validated['file_url'] ?? null,
                'submitted_at' => now(),
                'status' => ($assignment->due_date && now()->gt($assignment->due_date)) ? 'LATE' : 'PENDING',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Assignment submitted successfully!',
            'submission' => $submission,
        ]);
    }

    /**
     * Teacher grades assignment submission.
     */
    public function gradeSubmission(string $submissionId, Request $request): JsonResponse
    {
        $user = $request->user();
        $submission = Submission::with('assignment.classroom')->findOrFail($submissionId);

        if ($submission->assignment->classroom->teacher_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'] ?? null,
            'status' => 'GRADED',
            'graded_by' => $user->id,
            'graded_at' => now(),
        ]);

        // Award student tokens based on grade percentage
        $student = $submission->student;
        if ($student) {
            $tokensAward = (int) round(($validated['grade'] / 100) * 50);
            $student->increment('pp_tokens', $tokensAward);
        }

        return response()->json([
            'success' => true,
            'submission' => $submission->fresh(),
        ]);
    }
}
