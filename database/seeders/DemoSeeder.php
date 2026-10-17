<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Role;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Term;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Optional sample data:  php artisan db:seed --class=DemoSeeder
 * Logins: admin@school.test / teacher@school.test / student@school.test  (password: password)
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([PermissionSeeder::class, RoleSeeder::class]);

        $mk = function (string $name, string $email, string $roleKey) {
            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => Hash::make('password')]
            );
            UserRole::updateOrCreate(
                ['user_id' => $user->id],
                ['role_id' => Role::where('key', $roleKey)->value('id')]
            );
            return $user;
        };

        $mk('Demo Admin', 'admin@school.test', 'admin');
        $teacher = Teacher::firstOrCreate(['user_id' => $mk('Demo Teacher', 'teacher@school.test', 'teacher')->id]);

        $year = AcademicYear::firstOrCreate(
            ['name' => '2026-2027'],
            ['start_date' => '2026-09-01', 'end_date' => '2027-06-30']
        );
        Term::firstOrCreate(
            ['name' => 'Term 1 2026-2027'],
            ['academic_year_id' => $year->id, 'start_date' => '2026-09-01', 'end_date' => '2026-12-20']
        );

        $class = ClassModel::firstOrCreate(
            ['name' => 'Grade 10 A'],
            ['start_date' => '2026-09-01', 'room_number' => '101']
        );
        $class->teachers()->syncWithoutDetaching([$teacher->id]);

        foreach (['student@school.test' => 'Demo Student', 'student2@school.test' => 'Second Student'] as $email => $name) {
            $student = Student::firstOrCreate(['user_id' => $mk($name, $email, 'student')->id]);
            Enrollment::firstOrCreate(
                ['class_id' => $class->id, 'student_id' => $student->id],
                ['enrolled_on' => now()->toDateString()]
            );
        }
    }
}
