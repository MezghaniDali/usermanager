<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Test route to verify API is working
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working!',
        'version' => '1.0',
        'timestamp' => now()
    ]);
});

// Test MongoDB connection
Route::get('/test-db', function () {
    try {
        $userCount = \App\Models\User::count();
        return response()->json([
            'status' => 'success',
            'message' => 'Database connection successful!',
            'user_count' => $userCount
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });
    
    // Test protected route
    Route::get('/protected-test', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'message' => 'Protected route working!',
            'user' => $request->user()
        ]);
    });
});

// Fallback for undefined API routes
Route::fallback(function(){
    return response()->json([
        'status' => 'error',
        'message' => 'API endpoint not found'
    ], 404);
});