<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        $enrollments = Enrollment::with('class', 'student.user')
            ->when($request->query('class_id'), fn ($q, $v) => $q->where('class_id', $v))
            ->when($request->query('student_id'), fn ($q, $v) => $q->where('student_id', $v))
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $enrollments]);
    }

    /** Enroll one or many students: { class_id, student_id } or { class_id, student_ids: [] } */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => ['required', 'exists:class_models,id'],
            'student_id' => ['required_without:student_ids', 'exists:students,id'],
            'student_ids' => ['required_without:student_id', 'array', 'min:1'],
            'student_ids.*' => ['exists:students,id'],
            'enrolled_on' => ['nullable', 'date'],
        ]);

        $ids = $validated['student_ids'] ?? [$validated['student_id']];
        $created = [];
        $skipped = [];

        foreach (array_unique($ids) as $studentId) {
            $enrollment = Enrollment::firstOrCreate(
                ['class_id' => $validated['class_id'], 'student_id' => $studentId],
                ['enrolled_on' => $validated['enrolled_on'] ?? now()->toDateString()]
            );
            $enrollment->wasRecentlyCreated ? $created[] = $enrollment : $skipped[] = (int) $studentId;
        }

        return response()->json([
            'data' => $created,
            'skipped_student_ids' => $skipped,
            'message' => count($created)
                ? 'Student(s) enrolled successfully'
                : 'Student(s) were already enrolled',
        ], count($created) ? 201 : 200);
    }

    public function show(string $id)
    {
        return response()->json(['data' => Enrollment::with('class', 'student.user')->findOrFail($id)]);
    }

    public function destroy(string $id)
    {
        Enrollment::findOrFail($id)->delete();

        return response()->json(['message' => 'Enrollment removed']);
    }
}
