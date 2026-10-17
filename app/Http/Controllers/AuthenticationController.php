<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Models\Permission;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
    /** Current user with roles + permissions (used by the frontend after reload). */
    public function me(Request $request)
    {
        return response()->json(['data' => $this->userPayload($request->user())]);
    }

    public function checkToken(Request $request)
    {
        return $this->me($request);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function index(Request $request)
    {
        $users = User::with('roles')
            ->when($request->query('search'), fn ($q, $s) => $q->where(
                fn ($w) => $w->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")
            ))
            ->orderBy('id')
            ->get();

        return response()->json(['data' => $users]);
    }

    /** Public self-registration: always creates a STUDENT account. */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'], // hashed by the model cast
            ]);
            $studentRole = Role::where('key', 'student')->firstOrFail();
            UserRole::create(['user_id' => $user->id, 'role_id' => $studentRole->id]);
            Student::create(['user_id' => $user->id]);

            return $user;
        });

        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'data' => $this->userPayload($user),
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

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'data' => $this->userPayload($user),
            'access_token' => $token,
            'message' => 'User logged in successfully',
        ]);
    }

    public function show(string $id)
    {
        $user = User::with('roles', 'userprofile')->findOrFail($id);

        return response()->json(['data' => $user]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update($validated);

        return response()->json([
            'data' => $user->load('roles'),
            'message' => 'User updated successfully',
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 422);
        }
        if ($user->isSuperAdmin() && !$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Only a super admin can delete a super admin'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    private function userPayload(User $user): array
    {
        $user->load('roles', 'userprofile');

        return array_merge($user->toArray(), [
            'permissions' => $user->isSuperAdmin()
                ? Permission::pluck('key')->all()
                : $user->permissionKeys(),
        ]);
    }
}
