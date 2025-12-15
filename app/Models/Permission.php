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
        'user.view',
        'user.create',
        'user.update',
        'user.manage-role',
        'user.change-status',

        'prfile.view',
        'profile.create',
        'profile.update',
        'profile.change-visibility',
        'profile.lock',
        'profile.delete'
    ];
}
