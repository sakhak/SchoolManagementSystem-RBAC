<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'phone_number',
        'email',
        'address',
        'city',
        'province',
        'county',
        'profile_image',
        'guardian_name',
        'guardian_phone',
        'emergency_contact',
        'bio',
    ];
    public function users(){
        return $this->belongsTo(User::class, "user_id", 'id');
    }
}
