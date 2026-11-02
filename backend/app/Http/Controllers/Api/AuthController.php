<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Logging\AppLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'username' => 'nullable|string|max:50|unique:users',
            'role' => 'nullable|string|in:kid,parent,teacher,admin',
            'age' => 'nullable|integer|min:3|max:120',
            'invite_code' => 'nullable|string',
            'parent_id' => 'nullable|uuid|exists:users,id',
        ]);

        $role = $validated['role'] ?? 'kid';
        $username = $validated['username'] ?? Str::slug($validated['name']) . rand(100, 999);

        // Ensure username is unique
        while (User::where('username', $username)->exists()) {
            $username = Str::slug($validated['name']) . rand(1000, 9999);
        }

        // Handle referral or family invite
        $parentId = $validated['parent_id'] ?? null;
        $referredBy = null;
        if (!empty($validated['invite_code'])) {
            $inviter = User::where('invite_code', $validated['invite_code'])->first();
            if ($inviter) {
                if ($inviter->role === 'parent' && $role === 'kid') {
                    $parentId = $inviter->id;
                } else {
                    $referredBy = $inviter->id;
                    $inviter->increment('total_referrals');
                    // Award inviter referral bonus
                    $inviter->increment('pp_tokens', 50);
                }
            }
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'username' => $username,
            'password' => Hash::make($validated['password']),
            'role' => $role,
            'age' => $validated['age'] ?? null,
            'parent_id' => $parentId,
            'referred_by' => $referredBy,
            'invite_code' => strtoupper(Str::random(8)),
            'xp' => 0,
            'level' => 1,
            'pp_tokens' => 100, // Starter bonus
            'streak' => 1,
            'last_activity_date' => now()->toDateString(),
            'current_module_id' => 'mod_1',
            'badges' => ['Newbie'],
            'energy' => 5,
            'last_energy_refill' => round(microtime(true) * 1000),
            'subscription_status' => 'FREE',
            'subscription_tier' => 'intern',
            'settings' => [
                'soundEnabled' => true,
                'musicEnabled' => true,
                'darkMode' => false,
                'language' => 'en',
                'notifications' => true,
            ],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        AppLogger::info('auth.register.success', 'New user registered', [
            'user_id' => $user->id,
            'role' => $role,
            'age' => $validated['age'] ?? null,
            'has_parent' => !empty($parentId),
        ]);

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Log in a user with email or username.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login' => 'nullable|string',
            'email' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $identifier = $validated['login'] ?? $validated['email'] ?? null;
        if (!$identifier) {
            AppLogger::warn('auth.login.failed', 'Login attempted without identifier');
            throw ValidationException::withMessages([
                'email' => ['Please provide your email or username.'],
            ]);
        }

        $user = User::where('email', strtolower($identifier))
            ->orWhere('username', $identifier)
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            AppLogger::warn('auth.login.failed', 'Failed login credentials check', [
                'identifier' => $identifier,
                'ip_address' => $request->ip(),
            ]);
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        // Update streak & last activity date
        $today = now()->toDateString();
        if ($user->last_activity_date !== $today) {
            $yesterday = now()->subDay()->toDateString();
            if ($user->last_activity_date === $yesterday) {
                $user->increment('streak');
            } elseif ($user->last_activity_date !== null && $user->last_activity_date < $yesterday) {
                // Streak broken unless streak shield active
                if ($user->streak_shield) {
                    $user->update([
                        'streak_shield' => false,
                        'streak_shield_used_date' => $today,
                    ]);
                } else {
                    $user->streak = 1;
                }
            }
            $user->last_activity_date = $today;
            $user->save();
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AppLogger::info('auth.login.success', 'User logged in successfully', [
            'user_id' => $user->id,
            'role' => $user->role,
            'streak' => $user->streak,
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->fresh(),
            'token' => $token,
        ]);
    }

    /**
     * Log out and invalidate token.
     */
    public function logout(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $request->user()->currentAccessToken()->delete();

        AppLogger::info('auth.logout', 'User session terminated', [
            'user_id' => $userId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['parent', 'children']);

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }

    /**
     * Authenticate or register a user using Google OAuth ID token.
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'credential' => 'required|string',
            'role' => 'nullable|string|in:kid,parent,teacher,admin',
            'age' => 'nullable|integer|min:3|max:120',
            'invite_code' => 'nullable|string',
            'parent_id' => 'nullable|uuid|exists:users,id',
        ]);

        $credential = $validated['credential'];

        // Verify Google ID token using Google tokeninfo endpoint
        try {
            $googleResponse = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $credential,
            ]);

            if ($googleResponse->failed()) {
                AppLogger::warn('auth.google.invalid_token', 'Google token verification failed', [
                    'status' => $googleResponse->status(),
                    'body' => $googleResponse->json(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired Google authentication token.',
                ], 401);
            }

            $payload = $googleResponse->json();
        } catch (\Throwable $e) {
            AppLogger::error('auth.google.error', 'Exception during Google token verification', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Unable to connect to Google authentication services.',
            ], 500);
        }

        $googleId = $payload['sub'] ?? null;
        $email = isset($payload['email']) ? strtolower($payload['email']) : null;
        $name = $payload['name'] ?? ($payload['given_name'] ?? 'Adventurer');
        $picture = $payload['picture'] ?? null;

        if (!$googleId || !$email) {
            return response()->json([
                'success' => false,
                'message' => 'Google account did not provide a valid ID or email.',
            ], 422);
        }

        // Optional check: verify audience if GOOGLE_CLIENT_ID is configured
        $configuredClientId = config('services.google.client_id', env('GOOGLE_CLIENT_ID'));
        if ($configuredClientId && isset($payload['aud']) && $payload['aud'] !== $configuredClientId) {
            AppLogger::warn('auth.google.aud_mismatch', 'Google client ID mismatch', [
                'expected' => $configuredClientId,
                'received' => $payload['aud'],
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Google Client ID mismatch.',
            ], 401);
        }

        // Find existing user by google_id OR email
        $user = User::where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        $role = $validated['role'] ?? 'kid';

        if ($user) {
            // Existing user: Link google_id or update avatar if empty
            $userUpdates = [];
            if (empty($user->google_id)) {
                $userUpdates['google_id'] = $googleId;
            }
            if (empty($user->avatar) && !empty($picture)) {
                $userUpdates['avatar'] = $picture;
            }
            if (empty($user->email_verified_at)) {
                $userUpdates['email_verified_at'] = now();
            }

            // Update streak & last activity
            $today = now()->toDateString();
            if ($user->last_activity_date !== $today) {
                $yesterday = now()->subDay()->toDateString();
                if ($user->last_activity_date === $yesterday) {
                    $user->increment('streak');
                } elseif ($user->last_activity_date !== null && $user->last_activity_date < $yesterday) {
                    if ($user->streak_shield) {
                        $userUpdates['streak_shield'] = false;
                        $userUpdates['streak_shield_used_date'] = $today;
                    } else {
                        $userUpdates['streak'] = 1;
                    }
                }
                $userUpdates['last_activity_date'] = $today;
            }

            if (!empty($userUpdates)) {
                $user->update($userUpdates);
            }
        } else {
            // New user registration via Google
            $baseSlug = Str::slug($name) ?: 'patrol';
            $username = $baseSlug . rand(100, 999);
            while (User::where('username', $username)->exists()) {
                $username = $baseSlug . rand(1000, 9999);
            }

            $parentId = $validated['parent_id'] ?? null;
            $referredBy = null;
            if (!empty($validated['invite_code'])) {
                $inviter = User::where('invite_code', $validated['invite_code'])->first();
                if ($inviter) {
                    if ($inviter->role === 'parent' && $role === 'kid') {
                        $parentId = $inviter->id;
                    } else {
                        $referredBy = $inviter->id;
                        $inviter->increment('total_referrals');
                        $inviter->increment('pp_tokens', 50);
                    }
                }
            }

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'username' => $username,
                'google_id' => $googleId,
                'password' => Hash::make(Str::random(32)),
                'role' => $role,
                'age' => $validated['age'] ?? null,
                'avatar' => $picture,
                'parent_id' => $parentId,
                'referred_by' => $referredBy,
                'invite_code' => strtoupper(Str::random(8)),
                'xp' => 0,
                'level' => 1,
                'pp_tokens' => 100,
                'streak' => 1,
                'last_activity_date' => now()->toDateString(),
                'current_module_id' => 'mod_1',
                'badges' => ['Newbie'],
                'energy' => 5,
                'last_energy_refill' => round(microtime(true) * 1000),
                'subscription_status' => 'FREE',
                'subscription_tier' => 'intern',
                'email_verified_at' => now(),
                'settings' => [
                    'soundEnabled' => true,
                    'musicEnabled' => true,
                    'darkMode' => false,
                    'language' => 'en',
                    'notifications' => true,
                ],
            ]);

            AppLogger::info('auth.google.registered', 'New user registered via Google', [
                'user_id' => $user->id,
                'role' => $role,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        AppLogger::info('auth.google.success', 'User logged in via Google', [
            'user_id' => $user->id,
            'role' => $user->role,
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->fresh(),
            'token' => $token,
        ]);
    }

    /**
     * Get server time in UTC epoch ms (replaces get_server_time RPC).
     */
    public function getServerTime(): JsonResponse
    {
        return response()->json([
            'server_time' => (int) round(microtime(true) * 1000),
        ]);
    }
}
