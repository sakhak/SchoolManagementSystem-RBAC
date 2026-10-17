<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\ClassModel;
use App\Models\ClassSession;
use App\Models\Enrollment;
use App\Models\Term;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesUsers;
use Tests\TestCase;

class SchoolManagementTest extends TestCase
{
    use RefreshDatabase, CreatesUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    private function admin()
    {
        return tap($this->makeUser('admin'), fn ($u) => Sanctum::actingAs($u));
    }

    private function term(): Term
    {
        $year = AcademicYear::create(['name' => '2026', 'start_date' => '2026-01-01']);

        return Term::create(['name' => 'T1', 'academic_year_id' => $year->id, 'start_date' => '2026-01-01']);
    }

    // ---------------------------------------------------------------- people
    public function test_admin_student_crud(): void
    {
        $this->admin();

        $id = $this->postJson('/api/students', [
            'name' => 'Sok Dara', 'email' => 'dara@test.local', 'password' => 'password123',
        ])->assertCreated()->json('data.id');

        $this->assertDatabaseHas('user_roles', [
            'user_id' => \App\Models\Student::find($id)->user_id,
            'role_id' => \App\Models\Role::where('key', 'student')->value('id'),
        ]);

        $this->getJson('/api/students?search=Dara')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/students/{$id}")->assertOk()->assertJsonPath('data.user.name', 'Sok Dara');

        $this->putJson("/api/students/{$id}", ['status' => 'inactive', 'name' => 'Dara S'])
            ->assertOk()->assertJsonPath('data.status', 'inactive');
        $this->getJson('/api/students?status=active')->assertOk()->assertJsonCount(0, 'data');

        $this->deleteJson("/api/students/{$id}")->assertOk();
        $this->assertDatabaseMissing('students', ['id' => $id]);
    }

    public function test_student_creation_rejects_duplicate_email(): void
    {
        $this->admin();
        $payload = ['name' => 'A', 'email' => 'dup@test.local', 'password' => 'password123'];
        $this->postJson('/api/students', $payload)->assertCreated();
        $this->postJson('/api/students', $payload)->assertStatus(422);
    }

    public function test_admin_teacher_crud(): void
    {
        $this->admin();

        $id = $this->postJson('/api/teachers', [
            'name' => 'Mr Chea', 'email' => 'chea@test.local', 'password' => 'password123',
        ])->assertCreated()->json('data.id');

        $this->getJson('/api/teachers')->assertOk()->assertJsonCount(1, 'data');
        $this->putJson("/api/teachers/{$id}", ['status' => 'inactive'])->assertOk();
        $this->deleteJson("/api/teachers/{$id}")->assertOk();
    }

    // ------------------------------------------------------- classes/enroll
    public function test_class_crud_teacher_assignment_and_enrollment(): void
    {
        $this->admin();
        $teacher = $this->makeTeacher();
        $s1 = $this->makeStudent();
        $s2 = $this->makeStudent();

        $classId = $this->postJson('/api/classes', [
            'name' => 'Grade 7A', 'start_date' => '2026-01-01', 'room_number' => '12',
        ])->assertCreated()->json('data.id');

        $this->postJson("/api/classes/{$classId}/teachers", ['teacher_ids' => [$teacher->id]])->assertOk();
        $this->assertDatabaseHas('class_teachers', ['class_id' => $classId, 'teacher_id' => $teacher->id]);

        // bulk enroll, then enrolling again is idempotent
        $this->postJson('/api/enrollments', ['class_id' => $classId, 'student_ids' => [$s1->id, $s2->id]])
            ->assertCreated();
        $again = $this->postJson('/api/enrollments', ['class_id' => $classId, 'student_id' => $s1->id])->assertOk();
        $this->assertSame([$s1->id], $again->json('skipped_student_ids'));
        $this->assertDatabaseCount('enrollments', 2);

        $this->getJson("/api/classes/{$classId}")->assertOk()->assertJsonCount(2, 'data.enrollments');
        $this->getJson("/api/students?class_id={$classId}")->assertOk()->assertJsonCount(2, 'data');

        $this->putJson("/api/classes/{$classId}", ['name' => 'Grade 7B'])->assertOk()->assertJsonPath('data.name', 'Grade 7B');
        $this->deleteJson("/api/classes/{$classId}/teachers/{$teacher->id}")->assertOk();
        $this->assertDatabaseMissing('class_teachers', ['class_id' => $classId]);

        $enrollment = Enrollment::first();
        $this->deleteJson("/api/enrollments/{$enrollment->id}")->assertOk();
        $this->deleteJson("/api/classes/{$classId}")->assertOk();
    }

    public function test_class_end_date_must_not_precede_start_date(): void
    {
        $this->admin();
        $this->postJson('/api/classes', ['name' => 'X', 'start_date' => '2026-05-01', 'end_date' => '2026-01-01'])
            ->assertStatus(422);
    }

    public function test_student_only_sees_own_classes_and_no_roster(): void
    {
        $student = $this->makeStudent();
        $mine = ClassModel::create(['name' => 'Mine', 'start_date' => '2026-01-01']);
        $other = ClassModel::create(['name' => 'Other', 'start_date' => '2026-01-01']);
        Enrollment::create(['class_id' => $mine->id, 'student_id' => $student->id]);

        Sanctum::actingAs($student->user);
        $this->getJson('/api/classes')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Mine');
        $this->getJson("/api/classes/{$mine->id}")->assertOk()->assertJsonMissingPath('data.enrollments');
        $this->getJson("/api/classes/{$other->id}")->assertForbidden();
    }

    // ------------------------------------------------------------- calendar
    public function test_academic_year_and_term_crud(): void
    {
        $this->admin();
        $yearId = $this->postJson('/api/academic-years', ['name' => '2027', 'start_date' => '2027-01-01'])
            ->assertCreated()->json('data.id');
        $this->postJson('/api/academic-years', ['name' => '2027', 'start_date' => '2027-01-01'])->assertStatus(422);

        $termId = $this->postJson('/api/terms', [
            'name' => 'Term A', 'academic_year_id' => $yearId, 'start_date' => '2027-01-01', 'end_date' => '2027-04-01',
        ])->assertCreated()->json('data.id');

        $this->getJson("/api/terms?academic_year_id={$yearId}")->assertOk()->assertJsonCount(1, 'data');
        $this->putJson("/api/terms/{$termId}", ['name' => 'Term B'])->assertOk();
        $this->deleteJson("/api/terms/{$termId}")->assertOk();
        $this->deleteJson("/api/academic-years/{$yearId}")->assertOk();
    }

    // ------------------------------------------------- sessions + attendance
    private function classWithStudents(int $n = 2): array
    {
        $teacher = $this->makeTeacher();
        $class = ClassModel::create(['name' => 'C', 'start_date' => '2026-01-01']);
        $class->teachers()->attach($teacher->id);
        $students = collect(range(1, $n))->map(function () use ($class) {
            $s = $this->makeStudent();
            Enrollment::create(['class_id' => $class->id, 'student_id' => $s->id]);

            return $s;
        });

        return [$teacher, $class, $students];
    }

    public function test_teacher_creates_session_and_records_attendance(): void
    {
        $term = $this->term();
        [$teacher, $class, $students] = $this->classWithStudents(2);

        Sanctum::actingAs($teacher->user);

        $sessionId = $this->postJson('/api/class-sessions', [
            'class_id' => $class->id, 'term_id' => $term->id, 'session_date' => '2026-02-02',
        ])->assertCreated()->assertJsonPath('data.teacher_id', $teacher->id)->json('data.id');

        $this->getJson("/api/class-sessions/{$sessionId}/attendance")
            ->assertOk()->assertJsonCount(2, 'data.students')->assertJsonPath('data.students.0.status', null);

        $this->postJson("/api/class-sessions/{$sessionId}/attendance", ['records' => [
            ['student_id' => $students[0]->id, 'status' => 'present'],
            ['student_id' => $students[1]->id, 'status' => 'absent', 'comments' => 'sick'],
        ]])->assertOk();
        $this->assertDatabaseCount('attendance_records', 2);

        // correcting a mark updates (never duplicates) the row
        $this->postJson("/api/class-sessions/{$sessionId}/attendance", ['records' => [
            ['student_id' => $students[1]->id, 'status' => 'permission'],
        ]])->assertOk();
        $this->assertDatabaseCount('attendance_records', 2);
        $this->assertDatabaseHas('attendance_records', ['student_id' => $students[1]->id, 'status' => 'permission']);
    }

    public function test_attendance_rejects_invalid_status_and_non_enrolled_students(): void
    {
        $term = $this->term();
        [$teacher, $class, $students] = $this->classWithStudents(1);
        $outsider = $this->makeStudent();
        $session = ClassSession::create([
            'class_id' => $class->id, 'term_id' => $term->id, 'teacher_id' => $teacher->id, 'session_date' => '2026-02-02',
        ]);

        Sanctum::actingAs($teacher->user);
        $url = "/api/class-sessions/{$session->id}/attendance";

        $this->postJson($url, ['records' => [['student_id' => $students[0]->id, 'status' => 'late']]])->assertStatus(422);
        $this->postJson($url, ['records' => [['student_id' => $outsider->id, 'status' => 'present']]])->assertStatus(422);
        $this->assertDatabaseCount('attendance_records', 0);
    }

    public function test_teacher_cannot_touch_another_teachers_class(): void
    {
        $term = $this->term();
        [$teacher, $class] = $this->classWithStudents(1);
        $stranger = $this->makeTeacher();
        $session = ClassSession::create([
            'class_id' => $class->id, 'term_id' => $term->id, 'teacher_id' => $teacher->id, 'session_date' => '2026-02-02',
        ]);

        Sanctum::actingAs($stranger->user);
        $this->postJson('/api/class-sessions', ['class_id' => $class->id, 'term_id' => $term->id, 'session_date' => '2026-02-03'])
            ->assertForbidden();
        $this->getJson("/api/class-sessions/{$session->id}/attendance")->assertForbidden();
        $this->postJson("/api/class-sessions/{$session->id}/attendance", ['records' => [['student_id' => 1, 'status' => 'present']]])
            ->assertForbidden();
        $this->getJson('/api/class-sessions')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_students_cannot_record_attendance(): void
    {
        $term = $this->term();
        [$teacher, $class, $students] = $this->classWithStudents(1);
        $session = ClassSession::create([
            'class_id' => $class->id, 'term_id' => $term->id, 'teacher_id' => $teacher->id, 'session_date' => '2026-02-02',
        ]);

        Sanctum::actingAs($students[0]->user);
        $this->postJson("/api/class-sessions/{$session->id}/attendance", ['records' => [
            ['student_id' => $students[0]->id, 'status' => 'present'],
        ]])->assertForbidden();
    }

    public function test_canceled_session_cannot_take_attendance(): void
    {
        $term = $this->term();
        [$teacher, $class, $students] = $this->classWithStudents(1);
        $session = ClassSession::create([
            'class_id' => $class->id, 'term_id' => $term->id, 'teacher_id' => $teacher->id,
            'session_date' => '2026-02-02', 'status' => 'canceled',
        ]);

        Sanctum::actingAs($teacher->user);
        $this->postJson("/api/class-sessions/{$session->id}/attendance", ['records' => [
            ['student_id' => $students[0]->id, 'status' => 'present'],
        ]])->assertStatus(422);
    }

    public function test_report_and_student_self_view(): void
    {
        $term = $this->term();
        [$teacher, $class, $students] = $this->classWithStudents(1);
        $student = $students[0];

        Sanctum::actingAs($teacher->user);
        foreach (['present', 'present', 'absent', 'permission'] as $i => $status) {
            $s = ClassSession::create([
                'class_id' => $class->id, 'term_id' => $term->id, 'teacher_id' => $teacher->id,
                'session_date' => "2026-02-0".($i + 1),
            ]);
            $this->postJson("/api/class-sessions/{$s->id}/attendance", ['records' => [
                ['student_id' => $student->id, 'status' => $status],
            ]])->assertOk();
        }

        $row = $this->getJson("/api/attendance/report?class_id={$class->id}&term_id={$term->id}")
            ->assertOk()->json('data.0');
        $this->assertEquals(
            ['present' => 2, 'absent' => 1, 'permission' => 1, 'total' => 4, 'attendance_rate' => 50.0],
            collect($row)->only(['present', 'absent', 'permission', 'total', 'attendance_rate'])->all()
        );

        // date filter narrows the report
        $this->getJson("/api/attendance/report?class_id={$class->id}&from=2026-02-03")
            ->assertOk()->assertJsonPath('data.0.total', 2);

        Sanctum::actingAs($student->user);
        $this->getJson('/api/attendance/me')->assertOk()
            ->assertJsonPath('data.classes.0.total', 4)
            ->assertJsonPath('data.classes.0.attendance_rate', 50)
            ->assertJsonCount(4, 'data.records');
        $this->getJson('/api/attendance/report')->assertForbidden();
    }

    public function test_blacklist_flags_at_threshold_and_unflags_after_correction(): void
    {
        config(['school.absence_threshold' => 2]);
        $term = $this->term();
        [$teacher, $class, $students] = $this->classWithStudents(1);
        $student = $students[0];
        $sessions = collect(range(1, 2))->map(fn ($i) => ClassSession::create([
            'class_id' => $class->id, 'term_id' => $term->id, 'teacher_id' => $teacher->id, 'session_date' => "2026-03-0$i",
        ]));

        Sanctum::actingAs($teacher->user);
        $mark = fn ($session, $status) => $this->postJson("/api/class-sessions/{$session->id}/attendance", [
            'records' => [['student_id' => $student->id, 'status' => $status]],
        ])->assertOk();

        $mark($sessions[0], 'absent');
        $this->assertDatabaseCount('black_lists', 0);   // 1 absence < threshold 2

        $mark($sessions[1], 'absent');
        $this->assertDatabaseHas('black_lists', ['student_id' => $student->id, 'term_id' => $term->id, 'absences_count' => 2]);
        $this->getJson("/api/blacklist?term_id={$term->id}")->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('threshold', 2);

        $mark($sessions[1], 'permission');              // corrected -> back under threshold
        $this->assertDatabaseCount('black_lists', 0);
    }

    public function test_only_admin_like_roles_can_manage_blacklist(): void
    {
        $term = $this->term();
        Sanctum::actingAs($this->makeUser('teacher'));
        $this->postJson('/api/blacklist/recalculate', ['term_id' => $term->id])->assertForbidden();

        Sanctum::actingAs($this->makeUser('admin'));
        $this->postJson('/api/blacklist/recalculate', ['term_id' => $term->id])->assertOk();
    }
}
