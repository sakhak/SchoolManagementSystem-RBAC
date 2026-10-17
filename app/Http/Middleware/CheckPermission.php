<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Usage: ->middleware('permission:student.view')
 *        ->middleware('permission:student.view,teacher.view')  (any of them)
 * super_admin always passes.
 */
class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $owned = $user->permissionKeys();
        foreach ($permissions as $permission) {
            if (in_array($permission, $owned, true)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Forbidden. You do not have permission to perform this action.'], 403);
    }
}
