<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bounty;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BountyController extends Controller
{
    /**
     * Get family bounties.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'parent') {
            $bounties = Bounty::with('claimedBy')
                ->where('parent_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        } else {
            // Kid sees bounties from their parent or open bounties
            $parentId = $user->parent_id;
            $bounties = Bounty::with('parent')
                ->where(function ($query) use ($parentId, $user) {
                    if ($parentId) {
                        $query->where('parent_id', $parentId);
                    }
                    $query->orWhere('claimed_by', $user->id);
                })
                ->orderByDesc('created_at')
                ->get();
        }

        return response()->json([
            'success' => true,
            'bounties' => $bounties,
        ]);
    }

    /**
     * Parent creates a new family bounty.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'parent' && !$user->isAdmin()) {
            return response()->json(['error' => 'Only parents can create family bounties.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'reward' => 'required|integer|min:5|max:1000',
        ]);

        $bounty = Bounty::create([
            'parent_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'reward' => $validated['reward'],
            'status' => 'OPEN',
        ]);

        return response()->json([
            'success' => true,
            'bounty' => $bounty,
        ], 201);
    }

    /**
     * Kid claims bounty.
     */
    public function claim(string $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $bounty = Bounty::findOrFail($id);

        if ($bounty->status !== 'OPEN') {
            return response()->json(['error' => 'This bounty is no longer open.'], 400);
        }

        $bounty->update([
            'claimed_by' => $user->id,
            'claimed_at' => now(),
            'status' => 'IN_PROGRESS',
        ]);

        return response()->json([
            'success' => true,
            'bounty' => $bounty->fresh()->load('claimedBy'),
        ]);
    }

    /**
     * Kid marks bounty completed (pending parent approval).
     */
    public function complete(string $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $bounty = Bounty::findOrFail($id);

        if ($bounty->claimed_by !== $user->id && !$user->isAdmin()) {
            return response()->json(['error' => 'Only the claimant can mark this bounty complete.'], 403);
        }

        $bounty->update([
            'completed_at' => now(),
            'status' => 'PENDING_APPROVAL',
        ]);

        return response()->json([
            'success' => true,
            'bounty' => $bounty->fresh(),
        ]);
    }

    /**
     * Parent approves bounty and awards tokens in atomic transaction.
     */
    public function approve(string $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $bounty = Bounty::with('claimedBy')->findOrFail($id);

        if ($bounty->parent_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['error' => 'Only the parent can approve this bounty.'], 403);
        }

        if ($bounty->status === 'COMPLETED') {
            return response()->json(['error' => 'Bounty already approved and completed.'], 400);
        }

        return DB::transaction(function () use ($bounty) {
            $bounty->status = 'COMPLETED';
            $bounty->approved_at = now();
            $bounty->save();

            // Award tokens to kid
            if ($bounty->claimedBy) {
                $bounty->claimedBy->increment('pp_tokens', $bounty->reward);
                $bounty->claimedBy->increment('gigs_completed');
            }

            return response()->json([
                'success' => true,
                'message' => 'Bounty approved! Tokens awarded.',
                'bounty' => $bounty->fresh()->load('claimedBy'),
            ]);
        });
    }

    /**
     * Parent links child via invite code.
     */
    public function linkChild(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'parent' && !$user->isAdmin()) {
            return response()->json(['error' => 'Only parents can link children.'], 403);
        }

        $validated = $request->validate([
            'invite_code' => 'required|string',
        ]);

        $child = User::where('invite_code', strtoupper(trim($validated['invite_code'])))
            ->where('role', 'kid')
            ->first();

        if (!$child) {
            return response()->json(['error' => 'Child not found with this code.'], 404);
        }

        $child->parent_id = $user->id;
        $child->save();

        return response()->json([
            'success' => true,
            'message' => "Successfully linked {$child->name} to your family account!",
            'child' => $child,
        ]);
    }
}
