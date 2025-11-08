<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post('/register', [AuthenticationController::class, 'register']);
Route::post('/login', [AuthenticationController::class, 'login']);
Route::get('/users', [AuthenticationController::class, 'index']);
Route::get('/users/{id}', [AuthenticationController::class, 'show']);

Route::post('/permissions', [PermissionController::class, 'store']);
Route::put('/permissions/{id}', [PermissionController::class, 'update']);
Route::get('/permissions/{id}', [PermissionController::class, 'show']);
Route::get('/permissions', [PermissionController::class, 'index']);


Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::get('/roles/{id}', [RoleController::class, 'show']);
Route::get('/roles', [RoleController::class, 'index']);


Route::post('/role-permissions', [RolePermissionController::class, 'store']);
Route::get('/role-permissions', [RolePermissionController::class, 'index']);
Route::get('/role-permissions/{id}', [RolePermissionController::class, 'show']);

Route::post('/user-roles', [UserRoleController::class, 'store']);
Route::get('/user-roles/{id}', [UserRoleController::class, 'show']);
Route::post('/user-roles/{id}', [UserRoleController::class, 'update']);