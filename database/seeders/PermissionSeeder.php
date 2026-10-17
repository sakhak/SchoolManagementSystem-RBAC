<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Permission::permissions as $permission) {
            Permission::firstOrCreate(
                ['key' => $permission],
                ['name' => $permission]
            );
        }
    }
}
