<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/', function () {
    return view('welcome');
});

// Test MongoDB connection by fetching all users
Route::get('/test-mongodb', function () {
    return User::all();
});

Route::get('/test-mongo', function () {
    try {
        // Try to create a test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password')
        ]);
        
        return "MongoDB connection successful! User created with ID: " . $user->_id;
    } catch (Exception $e) {
        return "Connection failed: " . $e->getMessage();
    }
});
