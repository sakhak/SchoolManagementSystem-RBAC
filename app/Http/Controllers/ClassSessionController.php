<?php

namespace App\Http\Controllers;

use App\Models\ClassSession;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClassSessionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $ownTeacherId = $this->ownTeacherId($request);

        $sessions = ClassSession::with('class', 'term', 'teacher.user')->withCount('attendanceRecords')
            ->when($request->query('class_id'), fn ($q, $v) => $q->where('class_id', $v))
            ->when($request->query('term_id'), fn ($q, $v) => $q->where('term_id', $v))
            ->when($request->query('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->query('date'), fn ($q, $v) => $q->whereDate('session_date', $v))
            ->when($request->query('from'), fn ($q, $v) => $q->whereDate('session_date', '>=', $v))
            ->when($request->query('to'), fn ($q, $v) => $q->whereDate('session_date', '<=', $v))
            // a plain teacher only sees sessions of classes they teach
            ->when($ownTeacherId !== null, fn ($q) => $q->whereHas('class.teachers', fn ($t) => $t->where('teachers.id', $ownTeacherId)))
            ->orderByDesc('session_date')
            ->get();

        return response()->json(['data' => $sessions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => ['required', 'exists:class_models,id'],
            'term_id' => ['required', 'exists:terms,id'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
            'session_date' => ['required', 'date'],
            'status' => ['nullable', Rule::in(['scheduled', 'ongoing', 'completed', 'canceled'])],
        ]);

        $ownTeacherId = $this->ownTeacherId($request);
        if ($ownTeacherId !== null) {
            // teachers create sessions only for classes they teach, under their own name
            $teachesClass = $ownTeacherId > 0
                && Teacher::findOrFail($ownTeacherId)->classes()->where('class_models.id', $validated['class_id'])->exists();
            if (!$teachesClass) {
                return response()->json(['message' => 'You are not assigned to this class'], 403);
            }
            $validated['teacher_id'] = $ownTeacherId;
        }

        if (empty($validated['teacher_id'])) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['teacher_id' => ['The teacher id field is required.']],
            ], 422);
        }

        $session = ClassSession::create($validated);

        return response()->json([
            'data' => $session->load('class', 'term', 'teacher.user'),
            'message' => 'Class session created successfully',
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $session = ClassSession::with('class', 'term', 'teacher.user')->findOrFail($id);
        $this->authorizeSession($request, $session);

        return response()->json(['data' => $session]);
    }

    public function update(Request $request, string $id)
    {
        $session = ClassSession::findOrFail($id);
        $this->authorizeSession($request, $session);

        $validated = $request->validate([
            'term_id' => ['sometimes', 'required', 'exists:terms,id'],
            'teacher_id' => ['sometimes', 'required', 'exists:teachers,id'],
            'session_date' => ['sometimes', 'required', 'date'],
            'status' => ['sometimes', Rule::in(['scheduled', 'ongoing', 'completed', 'canceled'])],
        ]);
        if ($this->ownTeacherId($request) !== null) {
            unset($validated['teacher_id']);
        }
        $session->update($validated);

        return response()->json([
            'data' => $session->load('class', 'term', 'teacher.user'),
            'message' => 'Class session updated successfully',
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $session = ClassSession::findOrFail($id);
        $this->authorizeSession($request, $session);
        $session->delete();

        return response()->json(['message' => 'Class session deleted successfully']);
    }

    /** teachers.id of the caller when they are a "plain teacher" (not admin-like), else null. */
    public static function ownTeacherId(Request $request): ?int
    {
        $user = $request->user();
        if ($user->isSuperAdmin() || $user->hasRole('admin') || !$user->hasRole('teacher')) {
            return null;
        }

        return Teacher::where('user_id', $user->id)->value('id') ?? 0;
    }

    public static function authorizeSession(Request $request, ClassSession $session): void
    {
        $own = self::ownTeacherId($request);
        if ($own !== null) {
            $teaches = $session->class->teachers()->where('teachers.id', $own)->exists();
            abort_unless($teaches, 403, 'You are not assigned to this class');
        }
    }
}
