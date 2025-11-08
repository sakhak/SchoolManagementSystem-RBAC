<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get()->all();
        return response()->json([
            'data' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role_id' => ['required', 'exists:roles,id'],
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $userId = $user->id;
        $userRole = UserRole::create([
            'user_id' => $userId,
            'role_id' => $validated['role_id']
        ]);
        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'data' => $user,
            'user_role'=> $userRole,
            'access_token' => $token,
            'message' => 'User registered successfully',
        ], 201);
    }
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);
        if ($user = User::where('email', $validated['email'])->first()) {
            if (Hash::check($validated['password'], $user->password)) {
                $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;
                return response()->json([
                    'data' => $user->load("roles"),
                    'access_token' => $token,
                    'message' => 'User logged in successfully',
                ], 200);
            }
        }
        return response()->json([
            'message' => 'Invalid email or password',
        ], 401);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'. $id],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role_id' => ['required', 'exists:roles,id'],
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $userId = $user->id;
        $userRole = UserRole::create([
            'user_id' => $userId,
            'role_id' => $validated['role_id']
        ]);
        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'data' => $user,
            'user_role'=> $userRole,
            'access_token' => $token,
            'message' => 'User registered successfully',
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
