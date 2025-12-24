<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'status',
    ];
    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }
    public function enrollments(){
        return $this->hasOne(Enrollment::class,'student_id','id');
    }
    public function attendanceRecords(){
        return $this->hasMany(AttendanceRecord::class,'student_id','id');
    }
    public function blackLists(){
        return $this->hasMany(BlackList::class,'student_id','id');
    }
}
