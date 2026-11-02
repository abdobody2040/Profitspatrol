<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountDeletion;
use App\Models\ParentalGate;
use App\Models\User;
use App\Services\Logging\AppLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParentalGateController extends Controller
{
    /**
     * Atomically increment parental gate attempts (replaces increment_parental_gate_attempts RPC).
     */
    public function incrementAttempts(Request $request): JsonResponse
    {
        $user = $request->user();
        $maxAttempts = 3;
        $lockoutMs = 86400000; // 24 hours

        return DB::transaction(function () use ($user, $maxAttempts, $lockoutMs) {
            $user->parental_gate_attempts = ($user->parental_gate_attempts ?? 0) + 1;

            $isLocked = false;
            $lockedUntil = null;

            if ($user->parental_gate_attempts >= $maxAttempts) {
                $lockedUntil = now()->addMilliseconds($lockoutMs);
                $user->parental_gate_locked_until = $lockedUntil;
                $isLocked = true;
            }

            $user->save();

            // Log attempt to parental_gate table
            ParentalGate::create([
                'user_id' => $user->id,
                'attempt_count' => $user->parental_gate_attempts,
                'last_attempt_at' => now(),
                'locked_until' => $lockedUntil,
            ]);

            if ($isLocked) {
                AppLogger::security('security.parental_gate.lockout', 'Parental gate locked out due to max attempts exceeded', [
                    'user_id' => $user->id,
                    'attempts' => $user->parental_gate_attempts,
                    'locked_until' => $lockedUntil?->toISOString(),
                ], 'medium');
            } else {
                AppLogger::info('security.parental_gate.attempt', 'Parental gate attempt incremented', [
                    'user_id' => $user->id,
                    'attempts' => $user->parental_gate_attempts,
                ]);
            }

            return response()->json([
                'is_locked' => $isLocked,
                'attempts' => $user->parental_gate_attempts,
                'locked_until' => $lockedUntil ? $lockedUntil->toISOString() : null,
            ]);
        });
    }

    /**
     * Verify parental gate pass.
     */
    public function passGate(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if locked out
        if ($user->parental_gate_locked_until && now()->lt($user->parental_gate_locked_until)) {
            AppLogger::warn('security.parental_gate.rejected', 'Parental gate verification rejected: locked out', [
                'user_id' => $user->id,
                'locked_until' => $user->parental_gate_locked_until,
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Parental gate is currently locked. Try again later.',
                'locked_until' => $user->parental_gate_locked_until,
            ], 423);
        }

        $user->parental_gate_attempts = 0;
        $user->parental_gate_locked_until = null;
        $user->parental_gate_passed_at = now();
        $user->save();

        AppLogger::info('security.parental_gate.passed', 'Parental gate challenge passed successfully', [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Parental gate verified.',
        ]);
    }

    /**
     * Request COPPA account deletion (30-day grace period).
     */
    public function requestDeletion(Request $request): JsonResponse
    {
        $user = $request->user();
        $scheduledFor = now()->addDays(30);

        AccountDeletion::updateOrCreate(
            ['user_id' => $user->id],
            [
                'requested_at' => now(),
                'scheduled_for' => $scheduledFor,
                'cancelled_at' => null,
                'reason' => $request->input('reason', 'User request'),
            ]
        );

        $user->update([
            'deletion_requested_at' => now(),
            'deletion_scheduled_for' => $scheduledFor,
            'deletion_cancelled_at' => null,
        ]);

        AppLogger::security('security.coppa.deletion_requested', 'COPPA account deletion requested', [
            'user_id' => $user->id,
            'role' => $user->role,
            'scheduled_for' => $scheduledFor->toISOString(),
        ], 'high');

        return response()->json([
            'success' => true,
            'message' => 'Account scheduled for deletion in 30 days pursuant to COPPA regulations.',
            'scheduled_for' => $scheduledFor->toISOString(),
        ]);
    }

    /**
     * Cancel scheduled account deletion.
     */
    public function cancelDeletion(Request $request): JsonResponse
    {
        $user = $request->user();

        $deletion = AccountDeletion::where('user_id', $user->id)->first();
        if ($deletion) {
            $deletion->update(['cancelled_at' => now()]);
        }

        $user->update([
            'deletion_cancelled_at' => now(),
            'deletion_scheduled_for' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Account deletion request cancelled.',
        ]);
    }
}
