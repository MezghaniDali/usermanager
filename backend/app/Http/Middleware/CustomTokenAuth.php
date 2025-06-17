<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class CustomTokenAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token not provided'
                ], 401);
            }

            // Decode custom token
            $decoded = base64_decode($token);
            $parts = explode('|', $decoded);
            
            if (count($parts) !== 3) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid token format'
                ], 401);
            }

            $userId = $parts[0];
            $email = $parts[1];
            $timestamp = $parts[2];

            // Find user
            $user = User::find($userId);
            
            if (!$user || $user->email !== $email) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid token'
                ], 401);
            }

            // Optional: Check token expiration (24 hours)
            $tokenAge = now()->timestamp - $timestamp;
            $maxAge = 24 * 60 * 60; // 24 hours in seconds
            
            if ($tokenAge > $maxAge) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token expired'
                ], 401);
            }

            // Add user to request
            $request->setUserResolver(function() use ($user) {
                return $user;
            });

            return $next($request);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication failed',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}