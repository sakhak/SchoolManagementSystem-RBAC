<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\BlackList;
use App\Models\ClassSession;
use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AttendanceController extends Controller
{
    /** GET /class-sessions/{session}/attendance : every enrolled student + their mark (null = not marked yet) */
    public function showSession(Request $request, string $id)
    {
        $session = ClassSession::with('class', 'term')->findOrFail($id);
        ClassSessionController::authorizeSession($request, $session);

        $records = AttendanceRecord::where('class_session_id', $session->id)->get()->keyBy('student_id');

        $students = Enrollment::with('student.user')
            ->where('class_id', $session->class_id)
            ->get()
            ->map(fn ($e) => [
                'student_id' => $e->student_id,
                'name' => $e->student->user->name,
                'email' => $e->student->user->email,
                'status' => $records[$e->student_id]->status ?? null,
                'comments' => $records[$e->student_id]->comments ?? null,
            ])->values();

        return response()->json(['data' => ['session' => $session, 'students' => $students]]);
    }

    /**
     * POST /class-sessions/{session}/attendance
     * { records: [ { student_id, status: present|absent|permission, comments? } ] }
     */
    public function record(Request $request, string $id)
    {
        $session = ClassSession::findOrFail($id);
        ClassSessionController::authorizeSession($request, $session);

        if ($session->status === 'canceled') {
            return response()->json(['message' => 'Cannot record attendance for a canceled session'], 422);
        }

        $validated = $request->validate([
            'records' => ['required', 'array', 'min:1'],
            'records.*.student_id' => ['required', 'exists:students,id', 'distinct'],
            'records.*.status' => ['required', Rule::in(['present', 'absent', 'permission'])],
            'records.*.comments' => ['nullable', 'string', 'max:1000'],
        ]);

        // only students enrolled in the session's class may be marked
        $enrolled = Enrollment::where('class_id', $session->class_id)->pluck('student_id')->all();
        $outsiders = array_diff(array_column($validated['records'], 'student_id'), $enrolled);
        if ($outsiders) {
            return response()->json([
                'message' => 'Some students are not enrolled in this class',
                'student_ids' => array_values($outsiders),
            ], 422);
        }

        // recorded_by references teachers.id: use the caller's teacher record, else the session's teacher
        $recorderId = $request->user()->teacher?->id ?? $session->teacher_id;

        DB::transaction(function () use ($validated, $session, $recorderId) {
            foreach ($validated['records'] as $row) {
                AttendanceRecord::updateOrCreate(
                    ['class_session_id' => $session->id, 'student_id' => $row['student_id']],
                    [
                        'status' => $row['status'],
                        'comments' => $row['comments'] ?? null,
                        'recorded_by' => $recorderId,
                        'recorded_on' => now()->toDateString(),
                    ]
                );
            }
        });

        self::recalculateBlackList($session->term_id);

        return response()->json([
            'data' => AttendanceRecord::with('student.user')->where('class_session_id', $session->id)->get(),
            'message' => 'Attendance recorded successfully',
        ]);
    }

    /**
     * GET /attendance/report?class_id=&term_id=&from=&to=
     * Summary per student: present / absent / permission / rate.
     */
    public function report(Request $request)
    {
        $request->validate([
            'class_id' => ['nullable', 'exists:class_models,id'],
            'term_id' => ['nullable', 'exists:terms,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $own = ClassSessionController::ownTeacherId($request);

        $rows = AttendanceRecord::query()
            ->join('class_sessions', 'class_sessions.id', '=', 'attendance_records.class_session_id')
            ->when($request->query('class_id'), fn ($q, $v) => $q->where('class_sessions.class_id', $v))
            ->when($request->query('term_id'), fn ($q, $v) => $q->where('class_sessions.term_id', $v))
            ->when($request->query('from'), fn ($q, $v) => $q->whereDate('class_sessions.session_date', '>=', $v))
            ->when($request->query('to'), fn ($q, $v) => $q->whereDate('class_sessions.session_date', '<=', $v))
            ->when($own !== null, fn ($q) => $q->whereIn('class_sessions.class_id', function ($sub) use ($own) {
                $sub->select('class_id')->from('class_teachers')->where('teacher_id', $own);
            }))
            ->groupBy('attendance_records.student_id')
            ->selectRaw("attendance_records.student_id,
                SUM(CASE WHEN attendance_records.status = 'present' THEN 1 ELSE 0 END) AS present,
                SUM(CASE WHEN attendance_records.status = 'absent' THEN 1 ELSE 0 END) AS absent,
                SUM(CASE WHEN attendance_records.status = 'permission' THEN 1 ELSE 0 END) AS permission,
                COUNT(*) AS total")
            ->get();

        $students = Student::with('user')->whereIn('id', $rows->pluck('student_id'))->get()->keyBy('id');

        $data = $rows->map(fn ($r) => [
            'student_id' => $r->student_id,
            'name' => $students[$r->student_id]->user->name ?? null,
            'present' => (int) $r->present,
            'absent' => (int) $r->absent,
            'permission' => (int) $r->permission,
            'total' => (int) $r->total,
            'attendance_rate' => $r->total ? round($r->present / $r->total * 100, 1) : null,
        ])->values();

        return response()->json(['data' => $data]);
    }

    /** GET /attendance/me : the logged-in student's own attendance, grouped by class. */
    public function mine(Request $request)
    {
        $student = Student::where('user_id', $request->user()->id)->first();
        if (!$student) {
            return response()->json(['message' => 'No student record for this account'], 404);
        }

        $records = AttendanceRecord::with('classSession.class')
            ->where('student_id', $student->id)
            ->get();

        $byClass = $records->groupBy(fn ($r) => $r->classSession->class_id)->map(function ($group) {
            $present = $group->where('status', 'present')->count();

            return [
                'class_id' => $group->first()->classSession->class_id,
                'class_name' => $group->first()->classSession->class->name,
                'total' => $group->count(),
                'present' => $present,
                'absent' => $group->where('status', 'absent')->count(),
                'permission' => $group->where('status', 'permission')->count(),
                'attendance_rate' => round($present / $group->count() * 100, 1),
                'last_attendance' => $group->max(fn ($r) => $r->classSession->session_date),
            ];
        })->values();

        return response()->json([
            'data' => [
                'student_id' => $student->id,
                'classes' => $byClass,
                'records' => $records->map(fn ($r) => [
                    'session_id' => $r->class_session_id,
                    'class_name' => $r->classSession->class->name,
                    'session_date' => $r->classSession->session_date,
                    'status' => $r->status,
                    'comments' => $r->comments,
                ])->values(),
            ],
        ]);
    }

    /** Re-count absences for every student of a term and (un)flag them against the threshold. */
    public static function recalculateBlackList(int $termId): void
    {
        $threshold = max(1, (int) config('school.absence_threshold'));

        $counts = AttendanceRecord::query()
            ->join('class_sessions', 'class_sessions.id', '=', 'attendance_records.class_session_id')
            ->where('class_sessions.term_id', $termId)
            ->where('attendance_records.status', 'absent')
            ->groupBy('attendance_records.student_id')
            ->selectRaw('attendance_records.student_id, COUNT(*) AS absences')
            ->pluck('absences', 'student_id');

        $flagged = [];
        foreach ($counts as $studentId => $absences) {
            if ($absences >= $threshold) {
                $flagged[] = $studentId;
                BlackList::updateOrCreate(
                    ['student_id' => $studentId, 'term_id' => $termId],
                    ['absences_count' => $absences, 'flagged_on' => now()->toDateString()]
                );
            }
        }

        // students who dropped under the threshold (e.g. a mark was corrected) are un-flagged
        BlackList::where('term_id', $termId)->whereNotIn('student_id', $flagged)->delete();
    }
}
