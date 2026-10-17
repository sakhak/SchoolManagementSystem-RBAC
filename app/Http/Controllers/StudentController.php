<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Student;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::with('user.userprofile')
            ->when($request->query('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->query('class_id'), fn ($q, $v) => $q->whereHas('enrollments', fn ($e) => $e->where('class_id', $v)))
            ->when($request->query('search'), fn ($q, $s) => $q->whereHas('user', fn ($u) => $u
                ->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")))
            ->orderBy('id')
            ->paginate(min((int) $request->query('per_page', 15), 100));

        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id', 'unique:students,user_id'],
            'name' => ['required_without:user_id', 'string', 'max:255'],
            'email' => ['required_without:user_id', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required_without:user_id', 'string', 'min:8'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        $student = DB::transaction(function () use ($validated) {
            $user = isset($validated['user_id'])
                ? User::findOrFail($validated['user_id'])
                : User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                ]);

            // only set the student role if the user has no role yet
            UserRole::firstOrCreate(
                ['user_id' => $user->id],
                ['role_id' => Role::where('key', 'student')->firstOrFail()->id]
            );

            return Student::create([
                'user_id' => $user->id,
                'status' => $validated['status'] ?? 'active',
            ]);
        });

        return response()->json([
            'data' => $student->load('user'),
            'message' => 'Student created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        $student = Student::with('user.userprofile', 'classes', 'blackLists.term')->findOrFail($id);

        return response()->json(['data' => $student]);
    }

    public function update(Request $request, string $id)
    {
        $student = Student::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($student->user_id)],
            'password' => ['sometimes', 'required', 'string', 'min:8'],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ]);

        DB::transaction(function () use ($student, $validated) {
            $student->user->update(collect($validated)->only(['name', 'email', 'password'])->all());
            if (isset($validated['status'])) {
                $student->update(['status' => $validated['status']]);
            }
        });

        return response()->json([
            'data' => $student->fresh('user'),
            'message' => 'Student updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        // Removes the student record only; the user account is kept.
        Student::findOrFail($id)->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
}
