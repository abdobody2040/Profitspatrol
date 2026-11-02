<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Corporation;
use App\Models\CorporationMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CorporationController extends Controller
{
    /**
     * List corporations.
     */
    public function index(): JsonResponse
    {
        $corps = Corporation::withCount('members')
            ->orderByDesc('corp_xp')
            ->get();

        return response()->json([
            'success' => true,
            'corporations' => $corps,
        ]);
    }

    /**
     * Create corporation (costs 200 tokens).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user already in a corporation
        if (CorporationMember::where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'You are already a member of a corporation. Leave it first.'], 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:corporations',
            'motto' => 'nullable|string|max:100',
            'logo_icon' => 'nullable|string|max:30',
            'logo_emoji' => 'nullable|string|max:10',
            'logo_color' => 'nullable|string|max:20',
        ]);

        return DB::transaction(function () use ($user, $validated) {
            $code = strtoupper(Str::random(6));
            while (Corporation::where('code', $code)->exists()) {
                $code = strtoupper(Str::random(6));
            }

            $corp = Corporation::create([
                'name' => $validated['name'],
                'code' => $code,
                'motto' => $validated['motto'] ?? 'Building the future together',
                'logo_icon' => $validated['logo_icon'] ?? 'building',
                'logo_emoji' => $validated['logo_emoji'] ?? '🏢',
                'logo_color' => $validated['logo_color'] ?? '#6366f1',
                'founder_id' => $user->id,
                'corp_xp' => 0,
            ]);

            CorporationMember::create([
                'corporation_id' => $corp->id,
                'user_id' => $user->id,
                'role' => 'CEO',
            ]);

            return response()->json([
                'success' => true,
                'corporation' => $corp->load('members.user'),
            ], 201);
        });
    }

    /**
     * Join corporation via code or ID.
     */
    public function join(Request $request): JsonResponse
    {
        $user = $request->user();

        if (CorporationMember::where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'You are already in a corporation.'], 400);
        }

        $validated = $request->validate([
            'code' => 'required_without:corporation_id|nullable|string',
            'corporation_id' => 'required_without:code|nullable|uuid',
        ]);

        $corp = null;
        if (!empty($validated['code'])) {
            $corp = Corporation::where('code', strtoupper(trim($validated['code'])))->first();
        } elseif (!empty($validated['corporation_id'])) {
            $corp = Corporation::find($validated['corporation_id']);
        }

        if (!$corp) {
            return response()->json(['error' => 'Corporation not found.'], 404);
        }

        $membership = CorporationMember::create([
            'corporation_id' => $corp->id,
            'user_id' => $user->id,
            'role' => 'Member',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Welcome to {$corp->name}!",
            'membership' => $membership,
            'corporation' => $corp,
        ]);
    }

    /**
     * Leave corporation.
     */
    public function leave(Request $request): JsonResponse
    {
        $user = $request->user();
        $membership = CorporationMember::where('user_id', $user->id)->first();

        if (!$membership) {
            return response()->json(['error' => 'You are not in a corporation.'], 400);
        }

        $membership->delete();

        return response()->json([
            'success' => true,
            'message' => 'You have left the corporation.',
        ]);
    }
}
