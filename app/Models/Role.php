<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillable =[
        'name',
        'key',
        'description',
    ];
    public function permissions(){
        return $this->belongsToMany(Permission::class, 'role_permissions', 'role_id',  'permission_id');
    }
    public function users(){
        return $this->belongsToMany(User::class, 'user_roles', 'role_id', 'user_id');
    }
    const roles = [
        [
            'name' => 'Super Admin',
            'key'  => 'super_admin',
        ],
        [
            'name' => 'Admin',
            'key'  => 'admin',
         ],
        [
            'name' => 'Teacher',
            'key'  => 'teacher',
        ],
        [
            'name' => 'Student',
            'key'  => 'student',
        ]
    ];

    /**
     * Default permissions per role key. super_admin is handled in code
     * (it bypasses every permission check) so it is intentionally not listed.
     */
    public static function defaultPermissions(): array
    {
        $all = Permission::permissions;

        return [
            'admin' => array_values(array_diff($all, [
                'permission.manage',
                'role.manage',
            ])),
            'teacher' => [
                'profile.view', 'profile.create', 'profile.update',
                'student.view',
                'teacher.view',
                'class.view',
                'enrollment.view',
                'academic-year.view', 'term.view',
                'session.view', 'session.manage',
                'attendance.view', 'attendance.record', 'attendance.report',
                'blacklist.view',
            ],
            'student' => [
                'profile.view', 'profile.create', 'profile.update',
                'class.view',
                'attendance.view-own',
            ],
        ];
    }
}
