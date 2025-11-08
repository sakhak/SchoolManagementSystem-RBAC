<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get()->all();
        return response()->json([
            "list" => [
                "data" => $roles
            ]
            ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ["required", "string", "unique:roles,name"],
            'key' => ["required", "string", "unique:roles,key"],
            'description' => ["nullable","string"],
            'permission_id' => ['required', 'array'],
            'permission_id.*' => ['exists:permissions,id'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'key'=> $validated['key'],
            'description' => $validated['description']
        ]);

        $roleId = $role->id;
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

        return response()->json([
        'data' => [
            'role' => $role,
            'role_id' => $roleId,
            'permissions' => $rolePermission,
            'assigned_count' => $successCount,
            'skipped_permissions' => $skipped,
        ],
        'message' => $successCount > 0
            ? 'Role created and permissions assigned successfully.'
            : 'Role created but no new permissions were assigned (duplicates).',
    ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        return response()->json([
            "data" => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
         $validated = $request->validate([
            'name' => ["required", "string", "unique:roles,name," . $id],
            'key' => ["required", "string", "unique:roles,key," . $id],
            'description' => ["nullable","string"],
            'permission_id' => ['required', 'array'],
            'permission_id.*' => ['exists:permissions,id'],
        ]);

        $role->update([
            'name' => $validated['name'],
            'key'=> $validated['key'],
            'description' => $validated['description']
        ]);

        $roleId = $role->id;
        $successCount = 0;
        $rolePermission = [];
        
       RolePermission::where('role_id', $id)->delete();
        foreach ($validated['permission_id'] as $pid) {

            $rolePermission[] = RolePermission::create([
                'role_id' => $roleId,
                'permission_id' => $pid,
            ]);

            $successCount++;
        }

        return response()->json([
        'data' => [
            'role' => $role,
            'role_id' => $roleId,
            'permissions' => $rolePermission,
            'assigned_count' => $successCount,
        ],
        'message' => $successCount > 0
            ? 'Permissions updated successfully.'
            : 'No new permissions were assigned (possible duplicates).',
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
