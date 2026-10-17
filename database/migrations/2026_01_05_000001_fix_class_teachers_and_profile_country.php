<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // class_teachers.teacher_id used to reference users.id, but the Teacher
        // model (and class_sessions / attendance) use teachers.id. Rebuild it.
        Schema::dropIfExists('class_teachers');
        Schema::create('class_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('class_models')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();
            $table->unique(['class_id', 'teacher_id']);
        });

        // The API and the controller use "country"; the column was misspelled.
        if (Schema::hasColumn('user_profiles', 'county') && !Schema::hasColumn('user_profiles', 'country')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                $table->renameColumn('county', 'country');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('user_profiles', 'country')) {
            Schema::table('user_profiles', function (Blueprint $table) {
                $table->renameColumn('country', 'county');
            });
        }
    }
};
