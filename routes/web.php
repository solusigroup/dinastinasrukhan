<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\FamilyTreeController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\PendingApprovalController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [FamilyTreeController::class, 'index'])->name('home');

// Route for pending users (authenticated but not yet approved)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('pending-approval', [PendingApprovalController::class, 'index'])
        ->name('pending-approval');
});

// Authenticated + verified + approved routes
Route::middleware(['auth', 'verified', 'approved'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('gallery', [FamilyMemberController::class, 'gallery'])->name('gallery');
    Route::resource('family-members', FamilyMemberController::class);
    Route::get('family-tree', [FamilyMemberController::class, 'tree'])->name('family-tree');
});

// Admin routes (superadmin only)
Route::middleware(['auth', 'verified', 'approved', 'superadmin', 'throttle:60,1'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::get('users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::post('users/{user}/approve', [UserManagementController::class, 'approve'])->name('users.approve');
        Route::post('users/{user}/reject', [UserManagementController::class, 'reject'])->name('users.reject');
        Route::put('users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.update-role');
        Route::put('users/{user}/reset-password', [UserManagementController::class, 'resetPassword'])->name('users.reset-password');
        Route::post('users/{user}/assign-branch', [UserManagementController::class, 'assignBranch'])->name('users.assign-branch');
        Route::delete('users/{user}/remove-branch', [UserManagementController::class, 'removeBranch'])->name('users.remove-branch');
        Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    });

require __DIR__.'/settings.php';
