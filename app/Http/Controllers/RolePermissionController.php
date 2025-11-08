<?php

namespace App\Http\Controllers;

use App\Models\RolePermission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rolePermissions = RolePermission::all();
        return response()->json([
            'data' => $rolePermissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
   
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
            'permission_id' => ['required', 'array'],
            'permission_id.*' => ['exists:permissions,id'],
        ]);

        $roleId = $validated['role_id'];
        $successCount = 0;
        $skipped = [];

        $rolePermission = [];
        foreach ($validated['permission_id'] as $pid) {
            $exists = RolePermission::where('role_id', $roleId)
                ->where('permission_id', $pid)
                ->exists();

            if ($exists) {
                $skipped[] = $pid;
                continue;
            }

            $rolePermission[] = RolePermission::create([
                'role_id' => $roleId,
                'permission_id' => $pid,
            ]);

            $successCount++;
        }

        if ($successCount === 0) {
            return response()->json([
                'data' => null,
                'message' => 'No new permissions were assigned (all duplicates).',
                'skipped_permissions' => $skipped,
            ], 409);
        }

        return response()->json([
            'data' => [
                'role_id' => $roleId,
                'permissions' => $rolePermission,
                'assigned_count' => $successCount,
                'skipped_permissions' => $skipped,
            ],
            'message' => 'Permissions assigned to role successfully.',
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       $rolePermission = RolePermission::findOrFail($id);
       return response()->json([
           'data' => $rolePermission
       ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
