<?php

namespace Modules\Organization\Controllers;

use App\Http\Controllers\Controller;
use Modules\Organization\Models\Company;
use Modules\Organization\Requests\StoreCompanyRequest;
use Modules\Organization\Requests\UpdateCompanyRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at'); // default sort
        $direction = $request->input('direction', 'desc'); // default direction
        $filterField = $request->input('filterField');
        $filterOperator = $request->input('filterOperator');
        $filterValue = $request->input('filterValue');

        $query = Company::query();

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

        $companies = $query->paginate(10)->withQueryString();

        return Inertia::render('organization/company/index', [
            'companies' => $companies,
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
        return Inertia::render('organization/company/create');
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        Company::create($request->validated());
        return redirect()->route('companies.index')->with('success', 'Company created.');
    }

    public function edit(Company $company): Response
    {
        return Inertia::render('organization/company/edit', [
            'company' => $company,
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company): RedirectResponse
    {
        $company->update($request->validated());
        return redirect()->route('companies.index')->with('success', 'Company updated.');
    }

    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();
        return redirect()->route('companies.index')->with('success', 'Company deleted.');
    }
}
