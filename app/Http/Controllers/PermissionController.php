<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::all();
        return response()->json([
            "list" => [
                "data" => $permissions
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=> ["required","string","unique:permissions,name"],
            'key' => ["required","string","unique:permissions,key"],
            'description' => ["nullable","string"],
        ]);
        if($validated){
            $permission = Permission::create($validated);
            return response()->json([
                'data' => $permission,
                'message' => 'Permission created successfully',
            ], 201);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $permission = Permission::findOrFail($id);
        return response()->json([
            "data" => $permission
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $permission = Permission::findOrFail($id);
        
         $validated = $request->validate([
            'name'=> ["required","string","unique:permissions,name,".$id],
            'key' => ["required","string","unique:permissions,key,".$id],
            'description' => ["nullable","string"],
        ]);
        if($validated){
            $permission->update($validated);
            return response()->json([
                'data' => $permission,
                'message' => 'Permission updated successfully',
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
