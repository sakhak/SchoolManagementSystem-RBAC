<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserRoleController extends Controller
{
   

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role_id' => ['required', 'exists:roles,id'],
        ]);
        // one role per user (unique user_id): assigning again replaces the role
        $userRole = UserRole::updateOrCreate(
            ['user_id' => $validated['user_id']],
            ['role_id' => $validated['role_id']]
        );
        return response()->json([
            'data' => $userRole,
            'message' => 'Role assigned to user successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $userRole = UserRole::findOrFail($id);
        return response()->json([
            'data' => $userRole,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
public function update(Request $request)
{
    $validated = $request->validate([
        'user_id' => ['required', 'exists:users,id'],
        'role_id' => ['required', 'exists:roles,id'],
    ]);

    $userRole = UserRole::firstOrNew(['user_id' => $validated['user_id']]);

    if ($userRole->exists && $userRole->role_id == $validated['role_id']) {
        return response()->json([
            'message' => 'User already has this role',
        ], 409);
    }

    $userRole->role_id = $validated['role_id'];
    $userRole->save();

    return response()->json([
        'data' => $userRole,
        'message' => 'Role updated successfully',
    ]);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
