<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;

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
// Using custom middleware for token authentication
Route::middleware('custom.token.auth')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    // User management routes (CRUD) - Admin only
    Route::middleware('admin.only')->prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);           // GET /api/users - List all users
        Route::post('/', [UserController::class, 'store']);          // POST /api/users - Create new user
        Route::get('/stats', [UserController::class, 'stats']);      // GET /api/users/stats - User statistics
        Route::get('/{id}', [UserController::class, 'show']);        // GET /api/users/{id} - Get specific user
        Route::put('/{id}', [UserController::class, 'update']);      // PUT /api/users/{id} - Update user
        Route::patch('/{id}', [UserController::class, 'update']);    // PATCH /api/users/{id} - Partial update
        Route::delete('/{id}', [UserController::class, 'destroy']);  // DELETE /api/users/{id} - Delete user
    });
        
    // Test protected route
    Route::get('/protected-test', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'message' => 'Protected route working!',
            'user' => [
                'id' => $request->user()->_id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
            ]
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