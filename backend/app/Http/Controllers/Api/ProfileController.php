<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Logging\AppLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    /**
     * Get current user profile.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'profile' => $request->user(),
        ]);
    }

    /**
     * Update user profile settings, avatar, or customization.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
            'hq_level' => 'nullable|string|max:50',
            'hq_theme' => 'nullable|string|max:50',
            'business_logo' => 'nullable|array',
            'equipped_items' => 'nullable|array',
            'placed_items' => 'nullable|array',
            'unlocked_skills' => 'nullable|array',
            'properties' => 'nullable|array',
        ]);

        $user->update(array_filter($validated, fn($val) => !is_null($val)));

        return response()->json([
            'success' => true,
            'profile' => $user->fresh(),
        ]);
    }

    /**
     * Atomic lesson completion and reward awarding.
     */
    public function completeLesson(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lesson_id' => 'required|string',
            'xp_earned' => 'nullable|integer|min:0|max:500',
            'pp_tokens_earned' => 'nullable|integer|min:0|max:500',
            'quiz_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $user = $request->user();
        $lessonId = $validated['lesson_id'];
        $xpEarned = $validated['xp_earned'] ?? 50;
        $ppEarned = $validated['pp_tokens_earned'] ?? 20;

        return DB::transaction(function () use ($user, $lessonId, $xpEarned, $ppEarned) {
            $completedLessons = $user->completed_lesson_ids ?? [];
            $isFirstTime = !in_array($lessonId, $completedLessons);

            if ($isFirstTime) {
                $completedLessons[] = $lessonId;
                $user->completed_lesson_ids = array_values(array_unique($completedLessons));
                $user->lessons_completed = ($user->lessons_completed ?? 0) + 1;
            }

            // Award XP and tokens
            $user->xp = ($user->xp ?? 0) + $xpEarned;
            $user->season_xp = ($user->season_xp ?? 0) + $xpEarned;
            $user->pp_tokens = ($user->pp_tokens ?? 0) + $ppEarned;

            // Recalculate level (Every 500 XP = 1 Level)
            $newLevel = max(1, floor($user->xp / 500) + 1);
            $user->level = (int) $newLevel;

            // Update streak
            $today = now()->toDateString();
            $yesterday = now()->subDay()->toDateString();
            if ($user->last_activity_date === $yesterday) {
                $user->streak = ($user->streak ?? 0) + 1;
            } elseif ($user->last_activity_date !== $today) {
                $user->streak = 1;
            }
            $user->last_activity_date = $today;

            $user->save();

            AppLogger::info('education.lesson.completed', "Lesson {$lessonId} completed successfully", [
                'user_id' => $user->id,
                'lesson_id' => $lessonId,
                'module_id' => $moduleId,
                'xp_earned' => $xpEarned,
                'pp_tokens_earned' => $ppEarned,
                'is_first_time' => $isFirstTime,
                'streak' => $user->streak,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lesson completed successfully',
                'is_first_time' => $isFirstTime,
                'rewards' => [
                    'xp' => $xpEarned,
                    'pp_tokens' => $ppEarned,
                    'level' => $user->level,
                    'streak' => $user->streak,
                ],
                'profile' => $user->fresh(),
            ]);
        });
    }

    /**
     * Server-side award PP tokens (Translates award_pp_tokens RPC).
     */
    public function awardTokens(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'target_user_id' => 'required|uuid|exists:users,id',
            'amount' => 'required|integer|min:1|max:10000',
            'reason' => 'required|string|max:100',
        ]);

        $caller = $request->user();
        $targetUserId = $validated['target_user_id'];
        $amount = $validated['amount'];
        $reason = $validated['reason'];

        $allowedReasons = [
            'lesson_complete', 'game_reward', 'referral_bonus',
            'daily_mission', 'weekly_challenge', 'debate_win',
            'gig_complete', 'rent_collection', 'corporation_reward',
            'daily_spin', 'bounty_reward'
        ];

        if ($targetUserId !== $caller->id && !$caller->isAdmin()) {
            AppLogger::security('security.authorization_denied', 'Unauthorized attempt to award tokens to another user', [
                'caller_id' => $caller->id,
                'target_user_id' => $targetUserId,
                'amount' => $amount,
            ], 'high');
            return response()->json(['error' => 'Access denied. Cannot award tokens to another user.'], 403);
        }

        if ($targetUserId === $caller->id && !in_array($reason, $allowedReasons)) {
            AppLogger::warn('economy.tokens.invalid_reason', "Invalid reward reason attempted: {$reason}", [
                'user_id' => $caller->id,
                'reason' => $reason,
            ]);
            return response()->json(['error' => "Invalid reward reason: {$reason}"], 422);
        }

        $targetUser = ($targetUserId === $caller->id) ? $caller : User::findOrFail($targetUserId);
        $targetUser->increment('pp_tokens', $amount);

        AppLogger::info('economy.tokens.awarded', "Awarded {$amount} PP Tokens for {$reason}", [
            'caller_id' => $caller->id,
            'target_user_id' => $targetUser->id,
            'amount' => $amount,
            'reason' => $reason,
            'new_balance' => $targetUser->fresh()->pp_tokens,
        ]);

        return response()->json([
            'success' => true,
            'pp_tokens' => $targetUser->fresh()->pp_tokens,
            'amount_awarded' => $amount,
        ]);
    }

    /**
     * Daily Spin Claim.
     */
    public function claimSpin(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->toDateString();

        if ($user->last_spin_date === $today) {
            return response()->json([
                'success' => false,
                'error' => 'You have already spun the wheel today! Come back tomorrow.',
            ], 429);
        }

        $validated = $request->validate([
            'reward_type' => 'required|string|in:tokens,xp,energy,badge',
            'amount' => 'required|integer|min:1|max:1000',
        ]);

        $amount = $validated['amount'];
        $type = $validated['reward_type'];

        if ($type === 'tokens') {
            $user->increment('pp_tokens', $amount);
        } elseif ($type === 'xp') {
            $user->increment('xp', $amount);
            $user->increment('season_xp', $amount);
        } elseif ($type === 'energy') {
            $user->energy = min(5, ($user->energy ?? 0) + $amount);
        }

        $user->last_spin_date = $today;
        $user->increment('total_spins');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Reward claimed!',
            'profile' => $user->fresh(),
        ]);
    }

    /**
     * Buy Avatar Shop Item.
     */
    public function buyItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|string',
            'price' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        $price = $validated['price'];
        $itemId = $validated['item_id'];

        return DB::transaction(function () use ($user, $itemId, $price) {
            if ($user->pp_tokens < $price) {
                return response()->json([
                    'success' => false,
                    'error' => 'Insufficient PP tokens balance.',
                ], 400);
            }

            $inventory = $user->inventory ?? [];
            if (!in_array($itemId, $inventory)) {
                $inventory[] = $itemId;
            }

            $user->decrement('pp_tokens', $price);
            $user->inventory = $inventory;
            $user->save();

            return response()->json([
                'success' => true,
                'inventory' => $inventory,
                'pp_tokens' => $user->pp_tokens,
            ]);
        });
    }

    /**
     * Leaderboard (Global & Seasonal).
     */
    public function leaderboard(Request $request): JsonResponse
    {
        $type = $request->query('type', 'xp'); // 'xp' or 'season_xp'
        $sortColumn = ($type === 'season_xp') ? 'season_xp' : 'xp';

        $leaders = User::select(['id', 'name', 'username', 'xp', 'season_xp', 'level', 'avatar', 'hq_level'])
            ->where('role', 'kid')
            ->orderByDesc($sortColumn)
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'leaderboard' => $leaders,
        ]);
    }

    /**
     * Get all users for admin management.
     */
    public function adminAllUsers(Request $request): JsonResponse
    {
        $users = User::orderBy('role', 'asc')->orderBy('created_at', 'desc')->get();

        AppLogger::info('admin.users.accessed', 'Admin retrieved user roster', [
            'admin_id' => $request->user()?->id,
            'total_users' => $users->count(),
        ]);

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }
}
