<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $cfg = config('school.super_admin');

        $superAdmin = User::firstOrCreate(
            ['email' => $cfg['email']],
            ['name' => $cfg['name'], 'password' => Hash::make($cfg['password'])]
        );

        $role = Role::where('key', 'super_admin')->firstOrFail();
        UserRole::updateOrCreate(
            ['user_id' => $superAdmin->id],
            ['role_id' => $role->id]
        );
    }
}
