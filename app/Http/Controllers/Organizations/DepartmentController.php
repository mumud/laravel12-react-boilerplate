<?php

namespace App\Http\Controllers\Organizations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organizations\StoreDepartmentRequest;
use App\Http\Requests\Organizations\UpdateDepartmentRequest;
use App\Models\Organizations\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        if (!$request->user()->can('department.view')) {
            abort(403, 'Unauthorized');
        }

        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at'); // default sort
        $direction = $request->input('direction', 'desc'); // default direction
        $filterField = $request->input('filterField');
        $filterOperator = $request->input('filterOperator');
        $filterValue = $request->input('filterValue');

        $query = Department::with('division');

        if ($search || ($filterField && str_starts_with($filterField, 'division.'))) {
            $query->join('divisions', 'departments.division_id', '=', 'divisions.id')
                ->select('departments.*');
        }

        // Global search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Advanced filter
        if ($filterField && $filterOperator && $filterValue) {
            if (in_array($filterField, ['name', 'code'])) {
                $query->where(
                    "departments.$filterField",
                    $filterOperator === 'equals' ? '=' : 'like',
                    $filterOperator === 'equals' ? $filterValue : "%{$filterValue}%"
                );
            } elseif (in_array($filterField, ['division.name', 'division.code'])) {
                $field = str_replace('division.', 'divisions.', $filterField);
                $query->where(
                    $field,
                    $filterOperator === 'equals' ? '=' : 'like',
                    $filterOperator === 'equals' ? $filterValue : "%{$filterValue}%"
                );
            }
        }

        // Sorting
        if ($sort === 'division') {
            $query->join('divisions', 'departments.division_id', '=', 'divisions.id')
                ->orderBy('divisions.name', $direction)
                ->select('departments.*');
        } elseif (in_array($sort, ['name', 'code', 'created_at']) && in_array($direction, ['asc', 'desc'])) {
            $query->orderBy($sort, $direction);
        }

        $departments = $query->paginate(10)->withQueryString();

        return Inertia::render('organization/department/index', [
            'departments' => $departments->through(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'description' => $dept->description,
                    'division' => [
                        'id' => $dept->division?->id,
                        'name' => $dept->division?->name,
                        'code' => $dept->division?->code,
                        'label' => "[{$dept->division?->code}] {$dept->division?->name}",
                    ],
                    'created_at' => $dept->created_at->toDateTimeString(),
                ];
            }),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'filterField' => $filterField,
                'filterOperator' => $filterOperator,
                'filterValue' => $filterValue,
            ],
            'can' => [
                'create' => $request->user()->can('department.create'),
                'update' => $request->user()->can('department.update'),
                'delete' => $request->user()->can('department.delete'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('organization/department/create');
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::create($request->validated());
        return redirect()->route('departments.index')->with('success', 'Department created.');
    }

    public function edit(Department $department): Response
    {
        $department->load('division');

        $activities = Activity::where('subject_type', Department::class)
            ->where('subject_id', $department->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('organization/department/edit', [
            'department' => $department,
            'activities' => $activities,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $department->update($request->validated());
        return redirect()->route('departments.index')->with('success', 'Department updated.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();
        return redirect()->route('departments.index')->with('success', 'Department deleted.');
    }

    public function options()
    {
        $departments = Department::select('id', 'name', 'code')->orderBy('name')->get();

        return response()->json([
            'departments' => $departments,
        ]);
    }
}
