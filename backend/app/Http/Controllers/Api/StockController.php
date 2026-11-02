<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockCompany;
use App\Models\StockPortfolio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * List all stock companies.
     */
    public function index(): JsonResponse
    {
        $stocks = StockCompany::all();

        return response()->json([
            'success' => true,
            'stocks' => $stocks,
        ]);
    }

    /**
     * Get user's stock portfolio.
     */
    public function portfolio(Request $request): JsonResponse
    {
        $portfolio = StockPortfolio::with('stock')
            ->where('user_id', $request->user()->id)
            ->where('quantity', '>', 0)
            ->get();

        return response()->json([
            'success' => true,
            'portfolio' => $portfolio,
        ]);
    }

    /**
     * Buy stock shares.
     */
    public function buy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'stock_id' => 'required|string|exists:stock_companies,id',
            'quantity' => 'required|integer|min:1|max:10000',
        ]);

        $user = $request->user();
        $stock = StockCompany::findOrFail($validated['stock_id']);
        $quantity = $validated['quantity'];
        $totalCost = $stock->current_price * $quantity;

        return DB::transaction(function () use ($user, $stock, $quantity, $totalCost) {
            if ($user->pp_tokens < $totalCost) {
                return response()->json([
                    'success' => false,
                    'error' => "Not enough PP tokens. Required: {$totalCost}, Available: {$user->pp_tokens}",
                ], 400);
            }

            // Deduct tokens from user
            $user->decrement('pp_tokens', $totalCost);

            // Update or create portfolio entry
            $portfolio = StockPortfolio::firstOrNew([
                'user_id' => $user->id,
                'stock_id' => $stock->id,
            ]);

            $existingQty = $portfolio->quantity ?? 0;
            $existingAvgPrice = $portfolio->avg_buy_price ?? $stock->current_price;

            $newQty = $existingQty + $quantity;
            $newAvgPrice = (int) round((($existingQty * $existingAvgPrice) + $totalCost) / $newQty);

            $portfolio->quantity = $newQty;
            $portfolio->avg_buy_price = $newAvgPrice;
            $portfolio->last_updated = now();
            $portfolio->save();

            return response()->json([
                'success' => true,
                'message' => "Bought {$quantity} shares of {$stock->name}",
                'portfolio' => $portfolio->load('stock'),
                'pp_tokens' => $user->fresh()->pp_tokens,
            ]);
        });
    }

    /**
     * Sell stock shares.
     */
    public function sell(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'stock_id' => 'required|string|exists:stock_companies,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $stock = StockCompany::findOrFail($validated['stock_id']);
        $quantity = $validated['quantity'];

        return DB::transaction(function () use ($user, $stock, $quantity) {
            $portfolio = StockPortfolio::where('user_id', $user->id)
                ->where('stock_id', $stock->id)
                ->first();

            if (!$portfolio || $portfolio->quantity < $quantity) {
                $available = $portfolio ? $portfolio->quantity : 0;
                return response()->json([
                    'success' => false,
                    'error' => "Not enough shares to sell. Available: {$available}",
                ], 400);
            }

            $revenue = $stock->current_price * $quantity;
            $portfolio->quantity -= $quantity;

            if ($portfolio->quantity <= 0) {
                $portfolio->delete();
            } else {
                $portfolio->last_updated = now();
                $portfolio->save();
            }

            // Award tokens
            $user->increment('pp_tokens', $revenue);

            return response()->json([
                'success' => true,
                'message' => "Sold {$quantity} shares of {$stock->name}",
                'revenue' => $revenue,
                'remaining_quantity' => max(0, $portfolio->quantity ?? 0),
                'pp_tokens' => $user->fresh()->pp_tokens,
            ]);
        });
    }
}
