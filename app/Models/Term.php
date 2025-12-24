<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Term extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'academic_year_id',
        'start_date',
        'end_date',
    ];
    public function academicYear(){
        return $this->belongsTo(AcademicYear::class,'academic_year_id','id');
    }
    public function classSessions(){
        return $this->hasMany(ClassSession::class,'term_id','id');
    }
    public function blackLists(){
        return $this->hasMany(BlackList::class,'term_id','id');
    }
}
