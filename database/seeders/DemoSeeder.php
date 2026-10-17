<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\AttendanceRecord;
use App\Models\ClassModel;
use App\Models\ClassSession;
use App\Models\Enrollment;
use App\Models\BlackList;
use App\Models\Role;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Term;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Sample data: php artisan db:seed --class=DemoSeeder
 * Logins: admin@school.test / teacher@school.test / student@school.test  (password: password)
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([PermissionSeeder::class, RoleSeeder::class]);

        $makeUser = function (string $name, string $email, string $roleKey, array $profile) {
            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => Hash::make('password')]
            );
            UserRole::updateOrCreate(
                ['user_id' => $user->id],
                ['role_id' => Role::where('key', $roleKey)->value('id')]
            );

            UserProfile::updateOrCreate(['user_id' => $user->id], [
                ...$profile,
                'email' => $email,
            ]);

            return $user;
        };

        $makeUser('Demo Admin', 'admin@school.test', 'admin', [
            'first_name' => 'Demo',
            'last_name' => 'Admin',
            'phone_number' => '555-0100',
            'city' => 'Springfield',
            'country' => 'USA',
        ]);

        $teacherSpecs = [
            ['Demo Teacher', 'teacher@school.test', 'Alex', 'Morgan'],
            ['Second Teacher', 'teacher2@school.test', 'Jamie', 'Rivera'],
        ];
        $teachers = [];
        foreach ($teacherSpecs as [$name, $email, $firstName, $lastName]) {
            $user = $makeUser($name, $email, 'teacher', [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone_number' => '555-01' . (count($teachers) + 1),
                'city' => 'Springfield',
                'country' => 'USA',
            ]);
            $teachers[] = Teacher::updateOrCreate(
                ['user_id' => $user->id],
                ['status' => 'active']
            );
        }

        $studentSpecs = [
            ['student@school.test', 'Demo Student', 'Taylor', 'Morgan'],
            ['student2@school.test', 'Second Student', 'Jordan', 'Lee'],
            ['student3@school.test', 'Third Student', 'Casey', 'Patel'],
            ['student4@school.test', 'Fourth Student', 'Riley', 'Nguyen'],
        ];
        $students = [];
        foreach ($studentSpecs as [$email, $name, $firstName, $lastName]) {
            $user = $makeUser($name, $email, 'student', [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'date_of_birth' => '2010-04-15',
                'phone_number' => '555-02' . (count($students) + 1),
                'address' => '10 School Street',
                'city' => 'Springfield',
                'country' => 'USA',
                'guardian_name' => 'Morgan Guardian',
                'guardian_phone' => '555-0300',
            ]);
            $students[$email] = Student::updateOrCreate(
                ['user_id' => $user->id],
                ['status' => 'active']
            );
        }

        $year = AcademicYear::firstOrCreate(
            ['name' => '2026-2027'],
            ['start_date' => '2026-09-01', 'end_date' => '2027-06-30']
        );

        $terms = [
            Term::firstOrCreate(
                ['name' => 'Term 1 2026-2027'],
                ['academic_year_id' => $year->id, 'start_date' => '2026-09-01', 'end_date' => '2026-12-20']
            ),
            Term::firstOrCreate(
                ['name' => 'Term 2 2026-2027'],
                ['academic_year_id' => $year->id, 'start_date' => '2027-01-04', 'end_date' => '2027-03-26']
            ),
            Term::firstOrCreate(
                ['name' => 'Term 3 2026-2027'],
                ['academic_year_id' => $year->id, 'start_date' => '2027-04-05', 'end_date' => '2027-06-30']
            ),
        ];

        $classSpecs = [
            ['Grade 9 A', '201', $teachers[0], ['student3@school.test', 'student4@school.test']],
            ['Grade 10 A', '101', $teachers[0], ['student@school.test', 'student2@school.test', 'student3@school.test']],
            ['Grade 10 B', '102', $teachers[1], ['student@school.test', 'student4@school.test']],
        ];
        $sessionDates = ['2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28'];
        $blacklistAbsences = 0;
        $blacklistDate = null;

        foreach ($classSpecs as [$name, $room, $teacher, $studentEmails]) {
            $class = ClassModel::updateOrCreate(
                ['name' => $name],
                ['start_date' => '2026-09-01', 'end_date' => '2027-06-30', 'room_number' => $room]
            );
            $class->teachers()->syncWithoutDetaching([$teacher->id]);

            foreach ($studentEmails as $email) {
                Enrollment::updateOrCreate(
                    ['class_id' => $class->id, 'student_id' => $students[$email]->id],
                    ['enrolled_on' => '2026-09-01']
                );
            }

            foreach ($sessionDates as $sessionIndex => $date) {
                $session = ClassSession::updateOrCreate(
                    ['class_id' => $class->id, 'term_id' => $terms[0]->id, 'session_date' => $date],
                    ['teacher_id' => $teacher->id, 'status' => 'completed', 'created_on' => $date]
                );

                foreach ($studentEmails as $email) {
                    $status = match (true) {
                        $name === 'Grade 10 A' && $email === 'student@school.test' && $sessionIndex < 3 => 'absent',
                        $email === 'student2@school.test' && $sessionIndex === 2 => 'permission',
                        default => 'present',
                    };

                    AttendanceRecord::updateOrCreate(
                        ['class_session_id' => $session->id, 'student_id' => $students[$email]->id],
                        [
                            'recorded_by' => $teacher->id,
                            'status' => $status,
                            'comments' => $status === 'absent' ? 'No reason provided' : null,
                            'recorded_on' => $date,
                        ]
                    );

                    if ($status === 'absent' && $email === 'student@school.test') {
                        $blacklistAbsences++;
                        $blacklistDate = $date;
                    }
                }
            }

            ClassSession::updateOrCreate(
                ['class_id' => $class->id, 'term_id' => $terms[0]->id, 'session_date' => '2026-10-19'],
                ['teacher_id' => $teacher->id, 'status' => 'scheduled', 'created_on' => '2026-10-19']
            );
        }

        if ($blacklistAbsences >= max(1, (int) config('school.absence_threshold'))) {
            BlackList::updateOrCreate(
                ['student_id' => $students['student@school.test']->id, 'term_id' => $terms[0]->id],
                ['absences_count' => $blacklistAbsences, 'flagged_on' => $blacklistDate]
            );
        }
    }
}
