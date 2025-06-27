<?php

namespace Modules\Organization\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Organization\Models\Division;
use Modules\Organization\Requests\StoreDivisionRequest;
use Modules\Organization\Requests\UpdateDivisionRequest;

class DivisionController extends Controller
{
    public function index(Request $request): Response
    {
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
        return Inertia::render('organization/division/edit', [
            'division' => $division,
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
}
