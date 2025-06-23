<?php

use App\Modules\Organization\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::resource('companies', CompanyController::class);
