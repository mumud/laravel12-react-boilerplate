<?php

namespace App\Http\Controllers\Organizations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organizations\StoreDivisionRequest;
use App\Http\Requests\Organizations\UpdateDivisionRequest;
use App\Models\Organizations\Division;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DivisionController extends Controller
{
    public function index(Request $request): Response
    {
        if (!$request->user()->can('division.view')) {
            abort(403, 'Unauthorized');
        }

        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at'); // default sort
        $direction = $request->input('direction', 'desc'); // default direction
        $filterField = $request->input('filterField');
        $filterOperator = $request->input('filterOperator');
        $filterValue = $request->input('filterValue');

        $query = Division::query();

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
                if ($filterOperator === 'equals') {
                    $query->where($filterField, '=', $filterValue);
                } elseif ($filterOperator === 'contains') {
                    $query->where($filterField, 'like', "%{$filterValue}%");
                }
            }
        }

        // Sorting
        if (in_array($sort, ['name', 'code', 'created_at']) && in_array($direction, ['asc', 'desc'])) {
            $query->orderBy($sort, $direction);
        }

        $divisions = $query->paginate(10)->withQueryString();

        return Inertia::render('organization/division/index', [
            'divisions' => $divisions,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'filterField' => $filterField,
                'filterOperator' => $filterOperator,
                'filterValue' => $filterValue,
            ],
            'can' => [
                'create' => $request->user()->can('division.create'),
                'update' => $request->user()->can('division.update'),
                'delete' => $request->user()->can('division.delete'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('organization/division/create');
    }

    public function store(StoreDivisionRequest $request): RedirectResponse
    {
        Division::create($request->validated());
        return redirect()->route('divisions.index')->with('success', 'Division created.');
    }

    public function edit(Division $division): Response
    {
        $division->load('company');

        $activities = Activity::where('subject_type', Division::class)
            ->where('subject_id', $division->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('organization/division/edit', [
            'division' => $division,
            'activities' => $activities,
        ]);
    }

    public function update(UpdateDivisionRequest $request, Division $division): RedirectResponse
    {
        $division->update($request->validated());
        return redirect()->route('divisions.index')->with('success', 'Division updated.');
    }

    public function destroy(Division $division): RedirectResponse
    {
        $division->delete();
        return redirect()->route('divisions.index')->with('success', 'Division deleted.');
    }

    public function options()
    {
        $divisions = Division::select('id', 'name', 'code')->orderBy('name')->get();

        return response()->json([
            'divisions' => $divisions,
        ]);
    }
}
