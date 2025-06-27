<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

class ModuleServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $modules = File::directories(base_path('modules'));

        foreach ($modules as $modulePath) {
            $moduleName = basename($modulePath);
            $routePath = $modulePath . '/routes.php';

            if (file_exists($routePath)) {
                Route::middleware(['web', 'auth'])
                    ->prefix(strtolower($moduleName))
                    ->group($routePath);
            }
        }
    }
}
