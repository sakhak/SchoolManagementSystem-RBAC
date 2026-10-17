<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Role::roles as $role) {
            Role::firstOrCreate(
                ['key' => $role['key']],
                ['name' => $role['name']]
            );
        }

        // Attach default permissions (super_admin bypasses checks in code)
        foreach (Role::defaultPermissions() as $roleKey => $permissionKeys) {
            $role = Role::where('key', $roleKey)->first();
            if (!$role) {
                continue;
            }
            $ids = Permission::whereIn('key', $permissionKeys)->pluck('id');
            $role->permissions()->syncWithoutDetaching($ids);
        }
    }
}
