<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    // ...
}
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable,HasApiTokens;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function roles(){
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }
    public function roleKeys(): array
    {
        return $this->roles->pluck('key')->all();
    }
    public function hasRole(string ...$keys): bool
    {
        return count(array_intersect($keys, $this->roleKeys())) > 0;
    }
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }
    public function permissionKeys(): array
    {
        return Permission::whereHas('roles.users', fn ($q) => $q->where('users.id', $this->id))
            ->pluck('key')->unique()->values()->all();
    }
    public function hasPermission(string $key): bool
    {
        return $this->isSuperAdmin() || in_array($key, $this->permissionKeys(), true);
    }
    public function UserProfile(){
        return $this->hasOne(UserProfile::class,'user_id');
    }
    public function teacher(){
        return $this->hasOne(Teacher::class,'user_id');
    }
    public function student(){
        return $this->hasOne(Student::class,'user_id');
    }
}
