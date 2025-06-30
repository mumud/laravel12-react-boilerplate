<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Organizations\CompanyController;
use App\Http\Controllers\Organizations\DepartmentController;
use App\Http\Controllers\Organizations\DivisionController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('organizations')->group(function () {
        Route::get('companies/options', [CompanyController::class, 'options'])->name('companies.options');
        Route::get('divisions/options', [DivisionController::class, 'options'])->name('divisions.options');

        Route::resource('companies', CompanyController::class);
        Route::resource('divisions', DivisionController::class);
        Route::resource('departments', DepartmentController::class);
    });
});
