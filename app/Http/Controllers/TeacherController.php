<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Teacher;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Teacher::with('user.userprofile')
            ->when($request->query('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->query('class_id'), fn ($q, $v) => $q->whereHas('classes', fn ($c) => $c->where('class_models.id', $v)))
            ->when($request->query('search'), fn ($q, $s) => $q->whereHas('user', fn ($u) => $u
                ->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")))
            ->orderBy('id')
            ->paginate(min((int) $request->query('per_page', 15), 100));

        return response()->json($teachers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id', 'unique:teachers,user_id'],
            'name' => ['required_without:user_id', 'string', 'max:255'],
            'email' => ['required_without:user_id', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required_without:user_id', 'string', 'min:8'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        $teacher = DB::transaction(function () use ($validated) {
            $user = isset($validated['user_id'])
                ? User::findOrFail($validated['user_id'])
                : User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                ]);

            // only set the teacher role if the user has no role yet
            UserRole::firstOrCreate(
                ['user_id' => $user->id],
                ['role_id' => Role::where('key', 'teacher')->firstOrFail()->id]
            );

            return Teacher::create([
                'user_id' => $user->id,
                'status' => $validated['status'] ?? 'active',
            ]);
        });

        return response()->json([
            'data' => $teacher->load('user'),
            'message' => 'Teacher created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        $teacher = Teacher::with('user.userprofile', 'classes')->findOrFail($id);

        return response()->json(['data' => $teacher]);
    }

    public function update(Request $request, string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($teacher->user_id)],
            'password' => ['sometimes', 'required', 'string', 'min:8'],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        DB::transaction(function () use ($teacher, $validated) {
            $teacher->user->update(collect($validated)->only(['name', 'email', 'password'])->all());
            if (isset($validated['status'])) {
                $teacher->update(['status' => $validated['status']]);
            }
        });

        return response()->json([
            'data' => $teacher->fresh('user'),
            'message' => 'Teacher updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        // Removes the teacher record only; the user account is kept.
        Teacher::findOrFail($id)->delete();

        return response()->json(['message' => 'Teacher deleted successfully']);
    }
}
