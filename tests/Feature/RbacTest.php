<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesUsers;
use Tests\TestCase;

class RbacTest extends TestCase
{
    use RefreshDatabase, CreatesUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    public function test_student_cannot_manage_roles_permissions_or_people(): void
    {
        Sanctum::actingAs($this->makeUser('student'));

        $this->postJson('/api/roles', ['name' => 'Hacker', 'permission_id' => []])->assertForbidden();
        $this->postJson('/api/permissions', ['name' => 'x', 'key' => 'x'])->assertForbidden();
        $this->getJson('/api/users')->assertForbidden();
        $this->getJson('/api/students')->assertForbidden();
        $this->postJson('/api/students', [])->assertForbidden();
        $this->postJson('/api/classes', [])->assertForbidden();
    }

    public function test_student_cannot_make_themselves_super_admin(): void
    {
        $student = $this->makeUser('student');
        Sanctum::actingAs($student);

        $this->putJson('/api/user-roles', [
            'user_id' => $student->id,
            'role_id' => Role::where('key', 'super_admin')->value('id'),
        ])->assertForbidden();

        $this->assertTrue($student->fresh()->hasRole('student'));
    }

    public function test_admin_cannot_assign_admin_or_super_admin_but_can_assign_teacher(): void
    {
        $admin = $this->makeUser('admin');
        $target = $this->makeUser('student');
        Sanctum::actingAs($admin);

        foreach (['super_admin', 'admin'] as $key) {
            $this->putJson('/api/user-roles', ['user_id' => $target->id, 'role_id' => Role::where('key', $key)->value('id')])
                ->assertForbidden();
        }

        $this->putJson('/api/user-roles', ['user_id' => $target->id, 'role_id' => Role::where('key', 'teacher')->value('id')])
            ->assertOk();
        $this->assertTrue($target->fresh()->hasRole('teacher'));
    }

    public function test_super_admin_can_assign_any_role_and_manage_rbac(): void
    {
        $target = $this->makeUser('student');
        Sanctum::actingAs($this->superAdmin());

        $this->putJson('/api/user-roles', ['user_id' => $target->id, 'role_id' => Role::where('key', 'admin')->value('id')])
            ->assertOk();
        $this->postJson('/api/permissions', ['name' => 'custom.thing', 'key' => 'custom.thing'])->assertCreated();
        $this->getJson('/api/roles')->assertOk();
    }

    public function test_admin_has_school_permissions_but_not_rbac_definition_permissions(): void
    {
        $admin = $this->makeUser('admin');

        $this->assertTrue($admin->hasPermission('student.create'));
        $this->assertTrue($admin->hasPermission('user.manage-role'));
        $this->assertFalse($admin->hasPermission('role.manage'));
        $this->assertFalse($admin->hasPermission('permission.manage'));
    }

    public function test_permissions_follow_the_database_not_hard_coded_roles(): void
    {
        $teacher = $this->makeUser('teacher');
        $this->assertFalse($teacher->hasPermission('student.create'));

        // grant the permission to the teacher role at runtime -> access opens up
        $role = Role::where('key', 'teacher')->first();
        $role->permissions()->attach(\App\Models\Permission::where('key', 'student.create')->value('id'));

        Sanctum::actingAs($teacher->fresh());
        $this->postJson('/api/students', [
            'name' => 'Granted', 'email' => 'granted@test.local', 'password' => 'password123',
        ])->assertCreated();
    }

    public function test_profile_list_is_scoped_to_the_caller(): void
    {
        $a = $this->makeUser('student');
        $b = $this->makeUser('student');
        \App\Models\UserProfile::create(['user_id' => $a->id, 'first_name' => 'A']);
        \App\Models\UserProfile::create(['user_id' => $b->id, 'first_name' => 'B']);

        Sanctum::actingAs($a);
        $this->getJson('/api/userprofile')->assertOk()->assertJsonCount(1, 'data');

        Sanctum::actingAs($this->makeUser('admin'));
        $this->getJson('/api/userprofile')->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_profile_store_updates_instead_of_duplicating(): void
    {
        $user = $this->makeUser('student');
        Sanctum::actingAs($user);

        $this->postJson('/api/userprofile', ['first_name' => 'One', 'country' => 'KH'])->assertOk();
        $this->postJson('/api/userprofile', ['first_name' => 'Two', 'country' => 'KH'])->assertOk();

        $this->assertDatabaseCount('user_profiles', 1);
        $this->assertDatabaseHas('user_profiles', ['user_id' => $user->id, 'first_name' => 'Two', 'country' => 'KH']);
    }
}
