<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'class_session_id',
        'student_id',
        'recorded_by',
        'status',
        'comments',
        'recorded_on',
    ];
    public function classSession(){
        return $this->belongsTo(ClassSession::class,'class_session_id','id');
    }
    public function student(){
        return $this->belongsTo(Student::class,'student_id','id');
    }
    public function recorder(){
        return $this->belongsTo(Teacher::class,'recorded_by','id');
    }
}
