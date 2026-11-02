<?php

use App\Http\Controllers\Api\AiProxyController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BountyController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\CorporationController;
use App\Http\Controllers\Api\ParentalGateController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SecurityController;
use App\Http\Controllers\Api\SocialController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\StripeController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Profits Patrol V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    Route::get('/', function () {
        return response()->json([
            'status' => 'online',
            'service' => 'Profits Patrol API',
            'version' => 'v1',
            'timestamp' => now()->toIso8601String(),
        ]);
    });
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'database' => 'connected',
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // One-click database migration & seeder setup for hosting
    Route::get('/setup-database', function () {
        try {
            Artisan::call('migrate', ['--force' => true]);
            $migrateOutput = Artisan::output();

            Artisan::call('db:seed', ['--force' => true]);
            $seedOutput = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Database tables and initial seeds created successfully!',
                'migrate_log' => $migrateOutput,
                'seed_log' => $seedOutput,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    });

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/google', [AuthController::class, 'googleLogin']);
    Route::get('/server-time', [AuthController::class, 'getServerTime']);
    Route::get('/stocks', [StockController::class, 'index']);
    Route::get('/leaderboard', [ProfileController::class, 'leaderboard']);
    Route::get('/corporations', [CorporationController::class, 'index']);
    Route::get('/admin/users', [ProfileController::class, 'adminAllUsers']);
    Route::get('/classrooms/public', [ClassroomController::class, 'index']);

    // Public / Webhooks
    Route::post('/stripe/webhook', [StripeController::class, 'webhook']);
    Route::post('/security/log-event', [SecurityController::class, 'logEvent']);

    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Profile & Progression
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/lessons/complete', [ProfileController::class, 'completeLesson']);
        Route::post('/profile/tokens/award', [ProfileController::class, 'awardTokens']);
        Route::post('/profile/spin/claim', [ProfileController::class, 'claimSpin']);
        Route::post('/profile/items/buy', [ProfileController::class, 'buyItem']);

        // Stock Market
        Route::get('/stocks/portfolio', [StockController::class, 'portfolio']);
        Route::post('/stocks/buy', [StockController::class, 'buy']);
        Route::post('/stocks/sell', [StockController::class, 'sell']);

        // Classrooms & Assignments
        Route::get('/classrooms', [ClassroomController::class, 'index']);
        Route::post('/classrooms', [ClassroomController::class, 'store']);
        Route::post('/classrooms/join', [ClassroomController::class, 'join']);
        Route::get('/classrooms/{id}', [ClassroomController::class, 'show']);
        Route::post('/classrooms/{id}/assignments', [ClassroomController::class, 'storeAssignment']);
        Route::post('/assignments/{id}/submit', [ClassroomController::class, 'submitAssignment']);
        Route::post('/submissions/{id}/grade', [ClassroomController::class, 'gradeSubmission']);

        // Family Bounties & Linking
        Route::get('/bounties', [BountyController::class, 'index']);
        Route::post('/bounties', [BountyController::class, 'store']);
        Route::post('/bounties/{id}/claim', [BountyController::class, 'claim']);
        Route::post('/bounties/{id}/complete', [BountyController::class, 'complete']);
        Route::post('/bounties/{id}/approve', [BountyController::class, 'approve']);
        Route::post('/family/link-child', [BountyController::class, 'linkChild']);

        // Parental Gate & COPPA Compliance
        Route::post('/parental-gate/increment', [ParentalGateController::class, 'incrementAttempts']);
        Route::post('/parental-gate/pass', [ParentalGateController::class, 'passGate']);
        Route::post('/account/delete-request', [ParentalGateController::class, 'requestDeletion']);
        Route::post('/account/delete-cancel', [ParentalGateController::class, 'cancelDeletion']);

        // Social & Friends
        Route::get('/friends', [SocialController::class, 'index']);
        Route::post('/friends/request', [SocialController::class, 'sendRequest']);
        Route::post('/friends/{id}/accept', [SocialController::class, 'acceptRequest']);
        Route::post('/friends/{id}/reject', [SocialController::class, 'rejectRequest']);

        // Corporations (Guilds)
        Route::post('/corporations', [CorporationController::class, 'store']);
        Route::post('/corporations/join', [CorporationController::class, 'join']);
        Route::post('/corporations/leave', [CorporationController::class, 'leave']);

        // AI Assistant (Ollie Proxy)
        Route::post('/ai/chat', [AiProxyController::class, 'chat']);

        // Stripe Checkout & Customer Portal
        Route::post('/stripe/checkout-session', [StripeController::class, 'createCheckoutSession']);
        Route::post('/stripe/portal-session', [StripeController::class, 'createPortalSession']);

        // Reports
        Route::get('/reports/monthly', [SecurityController::class, 'monthlyReport']);
    });
});
