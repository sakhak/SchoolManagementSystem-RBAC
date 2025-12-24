<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
   use HasFactory;
    protected $fillable = [
        'class_id',
        'term_id',
        'teacher_id',
        'session_date',
        'status',
        'created_on',
    ];
    public function class(){
        return $this->belongsTo(ClassModel::class,'class_id','id');
    }
    public function term(){
        return $this->belongsTo(Term::class,'term_id','id');
    }
    public function teacher(){
        return $this->belongsTo(Teacher::class,'teacher_id','id');
    }
    public function attendanceRecords(){
        return $this->hasMany(AttendanceRecord::class,'class_session_id','id');
    }
}
