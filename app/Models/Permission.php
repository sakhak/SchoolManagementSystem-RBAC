<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'key',
        'description',
    ];

    public function roles(){
        return $this->belongsToMany(Role::class, 'role_permissions', 'permission_id', 'role_id');
    }
    public const permissions = [
        // users & roles
        'user.view',
        'user.create',
        'user.update',
        'user.delete',
        'user.manage-role',
        'user.change-status',
        'role.view',
        'role.manage',
        'permission.view',
        'permission.manage',

        // profiles
        'profile.view',
        'profile.create',
        'profile.update',
        'profile.change-visibility',
        'profile.lock',
        'profile.delete',

        // students / teachers
        'student.view',
        'student.create',
        'student.update',
        'student.delete',
        'teacher.view',
        'teacher.create',
        'teacher.update',
        'teacher.delete',

        // classes & enrollments
        'class.view',
        'class.create',
        'class.update',
        'class.delete',
        'class.assign-teacher',
        'enrollment.view',
        'enrollment.create',
        'enrollment.delete',

        // academic calendar
        'academic-year.view',
        'academic-year.manage',
        'term.view',
        'term.manage',

        // class sessions & attendance
        'session.view',
        'session.manage',
        'attendance.view',
        'attendance.record',
        'attendance.view-own',
        'attendance.report',
        'blacklist.view',
        'blacklist.manage',
    ];
}
