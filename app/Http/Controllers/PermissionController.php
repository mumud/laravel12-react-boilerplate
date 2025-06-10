<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('permissions/index', [
            'permissions' => Permission::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:permissions,name']);
        $request->validate(['description' => 'required']);
        Permission::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

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
