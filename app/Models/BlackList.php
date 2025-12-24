<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlackList extends Model
{
    use HasFactory;
    protected $fillable = [
        'student_id',
        'term_id',
        'absences_count',
        'flagged_on',
    ];
    public function student(){
        return $this->belongsTo(Student::class,'student_id','id');
    }
    public function term(){
        return $this->belongsTo(Term::class,'term_id','id');
    }
}
