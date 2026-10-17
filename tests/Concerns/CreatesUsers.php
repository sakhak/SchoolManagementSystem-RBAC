<?php

namespace Tests\Concerns;

use App\Models\Role;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Models\UserRole;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Support\Facades\Hash;

trait CreatesUsers
{
    protected function seedRbac(): void
    {
        $this->seed([PermissionSeeder::class, RoleSeeder::class, SuperAdminSeeder::class]);
    }

    protected function makeUser(string $roleKey, array $attrs = []): User
    {
        $user = User::create(array_merge([
            'name' => ucfirst($roleKey).' '.uniqid(),
            'email' => $roleKey.uniqid().'@test.local',
            'password' => 'password',
        ], $attrs));
        UserRole::create(['user_id' => $user->id, 'role_id' => Role::where('key', $roleKey)->value('id')]);

        return $user;
    }

    protected function superAdmin(): User
    {
        return User::where('email', config('school.super_admin.email'))->firstOrFail();
    }

    protected function makeStudent(array $attrs = []): Student
    {
        return Student::create(['user_id' => $this->makeUser('student', $attrs)->id]);
    }

    protected function makeTeacher(array $attrs = []): Teacher
    {
        return Teacher::create(['user_id' => $this->makeUser('teacher', $attrs)->id]);
    }
}
