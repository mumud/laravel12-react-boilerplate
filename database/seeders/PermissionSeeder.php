<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // List permissions
        $permissions = [
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            'permission.view',
            'permission.create',
            'permission.edit',
            'permission.delete',
            'company.view',
            'company.create',
            'company.update',
            'company.delete',
            'branch.view',
            'branch.create',
            'branch.update',
            'branch.delete',
            'division.view',
            'division.create',
            'division.update',
            'division.delete',
            'department.view',
            'department.create',
            'department.update',
            'department.delete',
            'position.view',
            'position.create',
            'position.update',
            'position.delete',
            'job-level.view',
            'job-level.create',
            'job-level.update',
            'job-level.delete',
            'employee.view',
            'employee.create',
            'employee.update',
            'employee.delete',
        ];

        // Buat permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Buat role dan assign permission
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions);
    }
}
