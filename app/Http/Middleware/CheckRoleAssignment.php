<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleAssignment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         $authUser = Auth::user();

        $roleIdToAssign = $request->input('role_id');
        $roleToAssign = Role::find($roleIdToAssign);

        if (!$roleToAssign) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        // Example hierarchy: only super_admin can assign admin or teacher
        if (in_array($roleToAssign->name, ['admin', 'teacher']) &&
            $authUser->role->name !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized to assign this role'], 403);
        }

        return $next($request);
    }
}
