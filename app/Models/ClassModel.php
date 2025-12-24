<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'room_number',
    ];
    public function teachers(){
        return $this->belongsToMany(Teacher::class, 'class_teachers', 'class_id', 'teacher_id')->withPivot('assigned_at');
    }
    public function classSessions(){
        return $this->hasMany(ClassSession::class,'class_id','id');
    }
    public function enrollments(){
        return $this->hasMany(Enrollment::class,'class_id','id');
    }
}
