<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\CreatesUsers;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, CreatesUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    public function test_register_creates_student_user_with_token(): void
    {
        $res = $this->postJson('/api/register', [
            'name' => 'New Kid', 'email' => 'kid@test.local',
            'password' => 'secret123', 'password_confirmation' => 'secret123',
        ]);

        $res->assertCreated()->assertJsonStructure(['access_token', 'data' => ['id', 'roles', 'permissions']]);
        $this->assertSame('student', $res->json('data.roles.0.key'));
        $this->assertDatabaseHas('students', ['user_id' => $res->json('data.id')]);
        $this->assertContains('attendance.view-own', $res->json('data.permissions'));
        $this->assertNotContains('role.manage', $res->json('data.permissions'));
    }

    public function test_register_validates_input(): void
    {
        $this->postJson('/api/register', ['email' => 'bad'])->assertStatus(422);
    }

    public function test_login_success_and_failure(): void
    {
        $user = $this->makeUser('teacher', ['email' => 't@test.local', 'password' => 'password']);

        $this->postJson('/api/login', ['email' => 't@test.local', 'password' => 'password'])
            ->assertOk()->assertJsonStructure(['access_token', 'data' => ['permissions']]);

        $this->postJson('/api/login', ['email' => 't@test.local', 'password' => 'wrong'])->assertStatus(401);
        $this->postJson('/api/login', ['email' => 'nobody@test.local', 'password' => 'x'])->assertStatus(401);
    }

    public function test_super_admin_login_gets_every_permission(): void
    {
        $res = $this->postJson('/api/login', [
            'email' => config('school.super_admin.email'),
            'password' => config('school.super_admin.password'),
        ])->assertOk();

        $this->assertContains('role.manage', $res->json('data.permissions'));
    }

    public function test_protected_routes_need_a_token_and_return_json_401(): void
    {
        $this->getJson('/api/students')->assertStatus(401);
        $this->getJson('/api/me')->assertStatus(401);
    }

    public function test_me_and_logout(): void
    {
        $user = $this->makeUser('student');
        $token = $user->createToken('t')->plainTextToken;

        $this->withToken($token)->getJson('/api/me')->assertOk()->assertJsonPath('data.id', $user->id);
        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_admin_can_update_a_user_without_creating_a_new_one(): void
    {
        $admin = $this->makeUser('admin');
        $target = $this->makeUser('student');
        $before = \App\Models\User::count();

        Sanctum::actingAs($admin);
        $this->putJson("/api/users/{$target->id}", ['name' => 'Renamed'])
            ->assertOk()->assertJsonPath('data.name', 'Renamed');

        $this->assertSame($before, \App\Models\User::count());
    }

    public function test_user_cannot_delete_self(): void
    {
        $admin = $this->makeUser('admin');
        Sanctum::actingAs($admin);
        $this->deleteJson("/api/users/{$admin->id}")->assertStatus(422);
    }
}
