<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'status',
    ];
    public function user(){
        return $this->belongsTo(User::class,'user_id','id'); 
    }
    public function classes(){
        return $this->belongsToMany(ClassModel::class, 'class_teachers', 'teacher_id', 'class_id')->withPivot('assigned_at');
    }
    public function classSessions(){
        return $this->hasMany(ClassSession::class,'teacher_id','id');
    }
    public function attendanceRecords(){
        return $this->hasMany(AttendanceRecord::class,'recorded_by','id');
    }
}
