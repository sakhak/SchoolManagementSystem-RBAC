<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // keep the newest row if duplicates exist, then enforce uniqueness
        DB::table('attendance_records')
            ->whereNotIn('id', function ($q) {
                $q->selectRaw('MAX(id)')->from('attendance_records')->groupBy('class_session_id', 'student_id');
            })->delete();

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->unique(['class_session_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropUnique(['class_session_id', 'student_id']);
        });
    }
};
