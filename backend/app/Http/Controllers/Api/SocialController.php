<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocialController extends Controller
{
    /**
     * Get friends and pending requests.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Accepted friends
        $accepted = Friend::with(['user', 'friend'])
            ->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)->orWhere('friend_id', $userId);
            })
            ->where('status', 'ACCEPTED')
            ->get();

        // Pending received requests
        $pendingReceived = Friend::with('user')
            ->where('friend_id', $userId)
            ->where('status', 'PENDING')
            ->get();

        return response()->json([
            'success' => true,
            'friends' => $accepted,
            'pending_requests' => $pendingReceived,
        ]);
    }

    /**
     * Send friend request by username or invite code.
     */
    public function sendRequest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'required|string',
        ]);

        $query = trim($validated['query']);
        $targetUser = User::where('id', $query)
            ->orWhere('username', $query)
            ->orWhere('invite_code', strtoupper($query))
            ->first();

        if (!$targetUser) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user = $request->user();
        if ($targetUser->id === $user->id) {
            return response()->json(['error' => 'You cannot friend yourself.'], 400);
        }

        $existing = Friend::where(function ($q) use ($user, $targetUser) {
            $q->where('user_id', $user->id)->where('friend_id', $targetUser->id);
        })->orWhere(function ($q) use ($user, $targetUser) {
            $q->where('user_id', $targetUser->id)->where('friend_id', $user->id);
        })->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Friend request already exists or you are already friends.',
                'status' => $existing->status,
            ]);
        }

        $friend = Friend::create([
            'user_id' => $user->id,
            'friend_id' => $targetUser->id,
            'status' => 'PENDING',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Friend request sent to {$targetUser->name}!",
            'friend' => $friend,
        ], 201);
    }

    /**
     * Accept friend request.
     */
    public function acceptRequest(string $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $friendReq = Friend::where('id', $id)
            ->where('friend_id', $user->id)
            ->firstOrFail();

        $friendReq->update(['status' => 'ACCEPTED']);

        return response()->json([
            'success' => true,
            'message' => 'Friend request accepted!',
        ]);
    }

    /**
     * Reject or delete friend.
     */
    public function rejectRequest(string $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $friend = Friend::where('id', $id)
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)->orWhere('friend_id', $user->id);
            })
            ->firstOrFail();

        $friend->delete();

        return response()->json([
            'success' => true,
            'message' => 'Friend removed.',
        ]);
    }
}
