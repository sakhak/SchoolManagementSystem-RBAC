<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Prevents privilege escalation when assigning roles:
 *  - only super_admin can hand out super_admin or admin
 *  - admin can hand out teacher / student only
 */
class CheckRoleAssignment
{
    public function handle(Request $request, Closure $next): Response
    {
        $authUser = $request->user();
        $roleToAssign = Role::find($request->input('role_id'));

        if (!$roleToAssign) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        if ($authUser->isSuperAdmin()) {
            return $next($request);
        }

        if (in_array($roleToAssign->key, ['super_admin', 'admin'], true)) {
            return response()->json(['message' => 'Unauthorized to assign this role'], 403);
        }

        return $next($request);
    }
}
