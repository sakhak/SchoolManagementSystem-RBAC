<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;
    protected $fillable = [
        'class_id',
        'student_id',
        'enrolled_on',
    ];
    public function class(){
        return $this->belongsTo(ClassModel::class,'class_id','id');
    }
    public function student(){
        return $this->belongsTo(Student::class,'student_id','id');
    }
}
