<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\BlackListController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ClassSessionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TermController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthenticationController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthenticationController::class, 'login'])->middleware('throttle:10,1');

/*
|--------------------------------------------------------------------------
| Authenticated  (every route below also needs a permission)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ---- session -----------------------------------------------------------
    Route::get('/me', [AuthenticationController::class, 'me']);
    Route::post('/logout', [AuthenticationController::class, 'logout']);

    // ---- users -------------------------------------------------------------
    Route::get('/users', [AuthenticationController::class, 'index'])->middleware('permission:user.view');
    Route::get('/users/{id}', [AuthenticationController::class, 'show'])->middleware('permission:user.view');
    Route::put('/users/{id}', [AuthenticationController::class, 'update'])->middleware('permission:user.update');
    Route::delete('/users/{id}', [AuthenticationController::class, 'destroy'])->middleware('permission:user.delete');

    // ---- own profile -------------------------------------------------------
    Route::get('/userprofile', [UserProfileController::class, 'index'])->middleware('permission:profile.view');
    Route::post('/userprofile', [UserProfileController::class, 'store'])->middleware('permission:profile.create,profile.update');

    // ---- RBAC management ---------------------------------------------------
    Route::get('/permissions', [PermissionController::class, 'index'])->middleware('permission:permission.view');
    Route::get('/permissions/{id}', [PermissionController::class, 'show'])->middleware('permission:permission.view');
    Route::post('/permissions', [PermissionController::class, 'store'])->middleware('permission:permission.manage');
    Route::put('/permissions/{id}', [PermissionController::class, 'update'])->middleware('permission:permission.manage');

    Route::get('/roles', [RoleController::class, 'index'])->middleware('permission:role.view');
    Route::get('/roles/{id}', [RoleController::class, 'show'])->middleware('permission:role.view');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('permission:role.manage');
    Route::put('/roles/{id}', [RoleController::class, 'update'])->middleware('permission:role.manage');

    Route::get('/role-permissions', [RolePermissionController::class, 'index'])->middleware('permission:role.view');
    Route::get('/role-permissions/{id}', [RolePermissionController::class, 'show'])->middleware('permission:role.view');
    Route::post('/role-permissions', [RolePermissionController::class, 'store'])->middleware('permission:role.manage');

    Route::get('/user-roles/{id}', [UserRoleController::class, 'show'])->middleware('permission:user.view');
    Route::post('/user-roles', [UserRoleController::class, 'store'])->middleware(['permission:user.manage-role', 'assign.role']);
    Route::put('/user-roles', [UserRoleController::class, 'update'])->middleware(['permission:user.manage-role', 'assign.role']);

    // ---- students / teachers ----------------------------------------------
    Route::get('/students', [StudentController::class, 'index'])->middleware('permission:student.view');
    Route::get('/students/{id}', [StudentController::class, 'show'])->middleware('permission:student.view');
    Route::post('/students', [StudentController::class, 'store'])->middleware('permission:student.create');
    Route::put('/students/{id}', [StudentController::class, 'update'])->middleware('permission:student.update');
    Route::delete('/students/{id}', [StudentController::class, 'destroy'])->middleware('permission:student.delete');

    Route::get('/teachers', [TeacherController::class, 'index'])->middleware('permission:teacher.view');
    Route::get('/teachers/{id}', [TeacherController::class, 'show'])->middleware('permission:teacher.view');
    Route::post('/teachers', [TeacherController::class, 'store'])->middleware('permission:teacher.create');
    Route::put('/teachers/{id}', [TeacherController::class, 'update'])->middleware('permission:teacher.update');
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy'])->middleware('permission:teacher.delete');

    // ---- classes & enrollments --------------------------------------------
    Route::get('/classes', [ClassController::class, 'index'])->middleware('permission:class.view');
    Route::get('/classes/{id}', [ClassController::class, 'show'])->middleware('permission:class.view');
    Route::post('/classes', [ClassController::class, 'store'])->middleware('permission:class.create');
    Route::put('/classes/{id}', [ClassController::class, 'update'])->middleware('permission:class.update');
    Route::delete('/classes/{id}', [ClassController::class, 'destroy'])->middleware('permission:class.delete');
    Route::post('/classes/{id}/teachers', [ClassController::class, 'assignTeachers'])->middleware('permission:class.assign-teacher');
    Route::delete('/classes/{id}/teachers/{teacherId}', [ClassController::class, 'removeTeacher'])->middleware('permission:class.assign-teacher');

    Route::get('/enrollments', [EnrollmentController::class, 'index'])->middleware('permission:enrollment.view');
    Route::get('/enrollments/{id}', [EnrollmentController::class, 'show'])->middleware('permission:enrollment.view');
    Route::post('/enrollments', [EnrollmentController::class, 'store'])->middleware('permission:enrollment.create');
    Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy'])->middleware('permission:enrollment.delete');

    // ---- academic calendar -------------------------------------------------
    Route::get('/academic-years', [AcademicYearController::class, 'index'])->middleware('permission:academic-year.view');
    Route::get('/academic-years/{id}', [AcademicYearController::class, 'show'])->middleware('permission:academic-year.view');
    Route::post('/academic-years', [AcademicYearController::class, 'store'])->middleware('permission:academic-year.manage');
    Route::put('/academic-years/{id}', [AcademicYearController::class, 'update'])->middleware('permission:academic-year.manage');
    Route::delete('/academic-years/{id}', [AcademicYearController::class, 'destroy'])->middleware('permission:academic-year.manage');

    Route::get('/terms', [TermController::class, 'index'])->middleware('permission:term.view');
    Route::get('/terms/{id}', [TermController::class, 'show'])->middleware('permission:term.view');
    Route::post('/terms', [TermController::class, 'store'])->middleware('permission:term.manage');
    Route::put('/terms/{id}', [TermController::class, 'update'])->middleware('permission:term.manage');
    Route::delete('/terms/{id}', [TermController::class, 'destroy'])->middleware('permission:term.manage');

    // ---- class sessions & attendance --------------------------------------
    Route::get('/class-sessions', [ClassSessionController::class, 'index'])->middleware('permission:session.view');
    Route::get('/class-sessions/{id}', [ClassSessionController::class, 'show'])->middleware('permission:session.view');
    Route::post('/class-sessions', [ClassSessionController::class, 'store'])->middleware('permission:session.manage');
    Route::put('/class-sessions/{id}', [ClassSessionController::class, 'update'])->middleware('permission:session.manage');
    Route::delete('/class-sessions/{id}', [ClassSessionController::class, 'destroy'])->middleware('permission:session.manage');

    Route::get('/class-sessions/{id}/attendance', [AttendanceController::class, 'showSession'])->middleware('permission:attendance.view');
    Route::post('/class-sessions/{id}/attendance', [AttendanceController::class, 'record'])->middleware('permission:attendance.record');
    Route::get('/attendance/report', [AttendanceController::class, 'report'])->middleware('permission:attendance.report');
    Route::get('/attendance/me', [AttendanceController::class, 'mine'])->middleware('permission:attendance.view-own');

    // ---- blacklist ---------------------------------------------------------
    Route::get('/blacklist', [BlackListController::class, 'index'])->middleware('permission:blacklist.view');
    Route::post('/blacklist/recalculate', [BlackListController::class, 'recalculate'])->middleware('permission:blacklist.manage');
    Route::delete('/blacklist/{id}', [BlackListController::class, 'destroy'])->middleware('permission:blacklist.manage');
});
