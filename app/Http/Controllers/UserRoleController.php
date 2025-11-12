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
        $userRole = UserRole::create($validated);
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
    // public function update(Request $request, string $id)
    // {
    //     $userRole = UserRole::findOrFail($id);
    //     $validated = $request->validate([
    //         'user_id' => ['required', 'exists:users,id'. $id],
    //         'role_id' => ['required', 'exists:roles,id'],
    //     ]);
    //     $existID = $validated['user_id'];
    //     // $show =UserRole::where("role_id",$id)->delete();
    //     $exists = UserRole::where('role_id', $existID)
    //     ->where('role_id', $existID)->exists();
    //     $userRole = UserRole::create($validated);
    //     if($exists){
    //         return response()->json([
    //             'data' => "User already assign role"
    //         ]);
    //     }
        
    //     return response()->json([
    //         'data' => $userRole,
    //         'message' => 'Role assigned to user successfully',
    //     ], 201);
    // }
   public function update(Request $request, string $id)
{
    $validated = $request->validate([
        'user_id' => ['required', 'exists:users,id'],
        'role_id' => ['required', 'exists:roles,id'],
    ]);

    // 🟡 Check if the same user-role combination already exists
    $exists = UserRole::where('user_id', $validated['user_id'])
        ->where('role_id', $validated['role_id'])
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'User already has this role',
        ], 409);
    }

    // 🟢 Otherwise, create a new user-role link
    $userRole = UserRole::create([
        'user_id' => $validated['user_id'],
        'role_id' => $validated['role_id'],
    ]);

    return response()->json([
        'data' => $userRole,
        'message' => 'Role assigned to user successfully',
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
