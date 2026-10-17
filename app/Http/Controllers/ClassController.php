<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $classes = ClassModel::with('teachers.user')->withCount('enrollments')
            ->when($request->query('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            // teachers only see their own classes unless they may manage classes
            ->when(
                $user->hasRole('teacher') && !$user->hasPermission('class.create'),
                fn ($q) => $q->whereHas('teachers', fn ($t) => $t->where('teachers.user_id', $user->id))
            )
            // students only see classes they are enrolled in
            ->when(
                $user->hasRole('student') && !$user->hasPermission('student.view'),
                fn ($q) => $q->whereHas('enrollments.student', fn ($s) => $s->where('user_id', $user->id))
            )
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $classes]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'room_number' => ['nullable', 'string', 'max:50'],
            'teacher_ids' => ['nullable', 'array'],
            'teacher_ids.*' => ['exists:teachers,id'],
        ]);

        $class = ClassModel::create(collect($validated)->except('teacher_ids')->all());
        if (!empty($validated['teacher_ids'])) {
            $class->teachers()->sync($validated['teacher_ids']);
        }

        return response()->json([
            'data' => $class->load('teachers.user'),
            'message' => 'Class created successfully',
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();
        $class = ClassModel::findOrFail($id);

        // the roster is only visible to people who may view students
        if (!$user->hasPermission('student.view')) {
            $enrolled = $class->enrollments()->whereHas('student', fn ($s) => $s->where('user_id', $user->id))->exists();
            abort_unless($enrolled, 403, 'You are not enrolled in this class');

            return response()->json(['data' => $class->load('teachers.user')]);
        }

        return response()->json(['data' => $class->load('teachers.user', 'enrollments.student.user')]);
    }

    public function update(Request $request, string $id)
    {
        $class = ClassModel::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'room_number' => ['nullable', 'string', 'max:50'],
        ]);
        $class->update($validated);

        return response()->json([
            'data' => $class->load('teachers.user'),
            'message' => 'Class updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        ClassModel::findOrFail($id)->delete();

        return response()->json(['message' => 'Class deleted successfully']);
    }

    /** POST /classes/{id}/teachers  { teacher_ids: [1,2] }  (adds, keeps existing) */
    public function assignTeachers(Request $request, string $id)
    {
        $class = ClassModel::findOrFail($id);
        $validated = $request->validate([
            'teacher_ids' => ['required', 'array', 'min:1'],
            'teacher_ids.*' => ['exists:teachers,id'],
        ]);

        $class->teachers()->syncWithoutDetaching($validated['teacher_ids']);

        return response()->json([
            'data' => $class->load('teachers.user'),
            'message' => 'Teachers assigned successfully',
        ]);
    }

    public function removeTeacher(string $id, string $teacherId)
    {
        $class = ClassModel::findOrFail($id);
        $class->teachers()->detach($teacherId);

        return response()->json(['message' => 'Teacher removed from class']);
    }
}
