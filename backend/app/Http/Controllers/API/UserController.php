<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users with pagination and search
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search', '');
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');

            $query = User::query();

            // Search functionality
            if (!empty($search)) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Sorting
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $users = $query->paginate($perPage);

            // Format response data
            $formattedUsers = $users->map(function($user) {
                return [
                    'id' => $user->_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Users retrieved successfully',
                'data' => [
                    'users' => $formattedUsers,
                    'pagination' => [
                        'current_page' => $users->currentPage(),
                        'last_page' => $users->lastPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                        'from' => $users->firstItem(),
                        'to' => $users->lastItem(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage(),
                'exception' => get_class($e),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if email already exists
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email already exists'
                ], 422);
            }

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => $request->role ?? 'user',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => [
                    'user' => [
                        'id' => $user->_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User creation failed',
                'error' => $e->getMessage(),
                'exception' => get_class($e),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User retrieved successfully',
                'data' => [
                    'user' => [
                        'id' => $user->_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve user',
                'error' => $e->getMessage(),
                'exception' => get_class($e)
            ], 500);
        }
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->_id, '_id')
                ],
                'password' => 'sometimes|nullable|string|min:8',
                'phone' => 'sometimes|nullable|string|max:20',
                'role' => 'sometimes|nullable|string|in:admin,user',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update user data
            $updateData = [];
            
            if ($request->has('name')) {
                $updateData['name'] = $request->name;
            }
            
            if ($request->has('email')) {
                // Check if email already exists for another user
                $existingUser = User::where('email', $request->email)
                                  ->where('_id', '!=', $user->_id)
                                  ->first();
                if ($existingUser) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Email already exists'
                    ], 422);
                }
                $updateData['email'] = $request->email;
            }
            
            if ($request->has('password') && !empty($request->password)) {
                $updateData['password'] = Hash::make($request->password);
            }
            
            if ($request->has('phone')) {
                $updateData['phone'] = $request->phone;
            }
            
            if ($request->has('role')) {
                $updateData['role'] = $request->role;
            }

            // Update the user
            $user->update($updateData);
            $user->refresh(); // Reload the model to get fresh data

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => [
                    'user' => [
                        'id' => $user->_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->role,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User update failed',
                'error' => $e->getMessage(),
                'exception' => get_class($e),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found'
                ], 404);
            }

            // Store user data before deletion for response
            $userData = [
                'id' => $user->_id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ];

            // Delete the user
            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully',
                'data' => [
                    'deleted_user' => $userData
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User deletion failed',
                'error' => $e->getMessage(),
                'exception' => get_class($e),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function stats()
    {
        try {
            $totalUsers = User::count();
            $adminUsers = User::where('role', 'admin')->count();
            $regularUsers = User::where('role', 'user')->count();
            $usersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();

            return response()->json([
                'status' => 'success',
                'message' => 'User statistics retrieved successfully',
                'data' => [
                    'stats' => [
                        'total_users' => $totalUsers,
                        'admin_users' => $adminUsers,
                        'regular_users' => $regularUsers,
                        'users_this_month' => $usersThisMonth,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve user statistics',
                'error' => $e->getMessage(),
                'exception' => get_class($e)
            ], 500);
        }
    }
}