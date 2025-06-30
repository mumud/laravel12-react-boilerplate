<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        if (!$request->user()->can('view permission')) {
            abort(403, 'Unauthorized');
        }

        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at'); // default sort
        $direction = $request->input('direction', 'desc'); // default direction
        $filterField = $request->input('filterField');
        $filterOperator = $request->input('filterOperator');
        $filterValue = $request->input('filterValue');

        $query = Permission::query();

        // Global search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Advanced filter
        if ($filterField && $filterOperator && $filterValue) {
            if (in_array($filterField, ['name', 'description'])) {
                if ($filterOperator === 'equals') {
                    $query->where($filterField, '=', $filterValue);
                } elseif ($filterOperator === 'contains') {
                    $query->where($filterField, 'like', "%{$filterValue}%");
                }
            }
        }

        // Sorting
        if (in_array($sort, ['name', 'description', 'created_at']) && in_array($direction, ['asc', 'desc'])) {
            $query->orderBy($sort, $direction);
        }

        $permissions = $query->paginate(10)->withQueryString();

        return Inertia::render('settings/permission/index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'filterField' => $filterField,
                'filterOperator' => $filterOperator,
                'filterValue' => $filterValue,
            ],
            'can' => [
                'create' => $request->user()->can('create permission'),
                'update' => $request->user()->can('update permission'),
                'delete' => $request->user()->can('delete permission'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:permissions,name']);
        $request->validate(['description' => 'required']);
        $permission = Permission::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        // Automatically assign this permission to admin role
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($permission);
        }

        return back()->with('success', 'Permission created.');
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate(['name' => 'required|unique:permissions,name,' . $permission->id]);
        $request->validate(['description' => 'required']);
        $permission->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return back()->with('success', 'Permission updated.');
    }

    public function destroy(Permission $permission)
    {
        if ($permission) {
            $permission->delete();
            return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully!');
        }

        return redirect()->back()->with('error', 'Unable to delete Permission. Please try again!');
    }
}
