<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Usage: ->middleware('role:admin,teacher')  (any of them; super_admin always passes)
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->isSuperAdmin() || $user->hasRole(...$roles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden. Your role cannot access this resource.'], 403);
    }
}
