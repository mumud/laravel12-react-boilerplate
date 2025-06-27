<?php

use Illuminate\Support\Facades\Route;
use Modules\Organization\Controllers\CompanyController;
use Modules\Organization\Controllers\DivisionController;

Route::resource('companies', CompanyController::class);
Route::resource('divisions', DivisionController::class);
