import ConfirmDialog from '@/components/confirm-dialog';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse } from '@/types';
import { ICompany } from '@/types/company';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Filter, Pencil, PlusIcon, RotateCw, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';

// Types
type CompanyPagination = PaginatedResponse<ICompany>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Organization', href: '#!' },
    { title: 'Company', href: '/companies' },
];

export default function Company() {
    const { companies, filters } = usePage<{
        companies: CompanyPagination;
        filters: {
            search?: string;
            sort?: string;
            direction?: 'asc' | 'desc';
            filterField?: string;
            filterOperator?: string;
            filterValue?: string;
        };
    }>().props;

    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || '');
    const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction || 'asc');
    const [filterField, setFilterField] = useState(filters.filterField || '');
    const [filterOperator, setFilterOperator] = useState(filters.filterOperator || '');
    const [filterValue, setFilterValue] = useState(filters.filterValue || '');

    const toggleSelect = (id: number) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selected.length === companies.data.length) {
            setSelected([]);
        } else {
            setSelected(companies.data.map((c) => c.id));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('companies.index'),
            {
                search,
                sort,
                direction,
                filterField,
                filterOperator,
                filterValue,
            },
            { preserveScroll: true },
        );
    };

    const handleSort = (field: string) => {
        const newDirection = sort === field && direction === 'asc' ? 'desc' : 'asc';
        setSort(field);
        setDirection(newDirection);
        router.get(
            route('companies.index'),
            {
                search,
                sort,
                direction,
                filterField,
                filterOperator,
                filterValue,
            },
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Company</h1>
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search companies..."
                                className="w-full rounded-md border border-input bg-background py-1 pr-10 pl-9 text-sm shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(route('companies.index'), {}, { preserveScroll: true });
                                    }}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </form>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4" /> Filter
                                    {filterField && filterOperator && filterValue && (
                                        <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">1</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-[500px] space-y-2">
                                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Field</label>
                                            <Select value={filterField} onValueChange={setFilterField}>
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Select field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="name">Name</SelectItem>
                                                    <SelectItem value="code">Code</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium">Operator</label>
                                            <Select value={filterOperator} onValueChange={setFilterOperator}>
                                                <SelectTrigger className="w-full text-sm">
                                                    <SelectValue placeholder="Select operator" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="equals">Equals</SelectItem>
                                                    <SelectItem value="contains">Contains</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-1 flex-col gap-1">
                                            <label className="font-medium">Value</label>
                                            <input
                                                type="text"
                                                value={filterValue}
                                                onChange={(e) => setFilterValue(e.target.value)}
                                                className="h-9 w-full rounded-md border px-2 py-1 shadow-xs"
                                                placeholder="Enter value..."
                                            />
                                            <input type="submit" hidden />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setFilterField('');
                                                setFilterOperator('');
                                                setFilterValue('');
                                                router.get(route('companies.index'), { search });
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                        <Button size="sm" type="submit">
                                            Apply Filters
                                        </Button>
                                    </div>
                                </form>
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline" size="sm" onClick={() => router.reload({ preserveUrl: true })}>
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Link href="companies/create">
                            <Button size="sm">
                                <PlusIcon className="h-4 w-4" /> Add Company
                            </Button>
                        </Link>
                    </div>
                </div>

                {selected.length > 0 && (
                    <div className="flex items-center justify-between rounded border bg-muted px-4 py-2 text-sm">
                        <div>{selected.length} selected</div>
                        <div className="space-x-2">
                            <ConfirmDialog
                                trigger={
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-1 h-4 w-4" /> Delete Selected
                                    </Button>
                                }
                                title="Delete Selected Companies"
                                description={`Are you sure you want to delete ${selected.length} companies? This action cannot be undone.`}
                                confirmText="Yes, Delete"
                                onConfirm={() => {
                                    selected.forEach((id) => {
                                        router.delete(`companies/${id}`, {
                                            preserveScroll: true,
                                        });
                                    });
                                    setSelected([]);
                                }}
                            />
                        </div>
                    </div>
                )}

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="w-[50px] p-3 text-center">
                                            <input type="checkbox" checked={selected.length === companies.data.length} onChange={toggleSelectAll} />
                                        </th>
                                        <th className="cursor-pointer p-3 text-left font-semibold" onClick={() => handleSort('name')}>
                                            Name{' '}
                                            {sort === 'name' &&
                                                (direction === 'asc' ? (
                                                    <ArrowUp className="inline-block h-4 w-4" />
                                                ) : (
                                                    <ArrowDown className="inline-block h-4 w-4" />
                                                ))}
                                        </th>
                                        <th className="cursor-pointer p-3 text-left font-semibold" onClick={() => handleSort('code')}>
                                            Code{' '}
                                            {sort === 'code' &&
                                                (direction === 'asc' ? (
                                                    <ArrowUp className="inline-block h-4 w-4" />
                                                ) : (
                                                    <ArrowDown className="inline-block h-4 w-4" />
                                                ))}
                                        </th>
                                        <th className="w-[100px] p-3 text-center font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.data.map((company) => (
                                        <tr key={company.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(company.id)}
                                                    onChange={() => toggleSelect(company.id)}
                                                />
                                            </td>
                                            <td className="p-3">{company.name}</td>
                                            <td className="p-3 text-muted-foreground">{company.code}</td>
                                            <td className="flex gap-1 p-3">
                                                <Link href={`companies/${company.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <ConfirmDialog
                                                    trigger={
                                                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                    title="Delete Company"
                                                    description={`Are you sure you want to delete "${company.name}"? This action cannot be undone.`}
                                                    confirmText="Yes, Delete"
                                                    onConfirm={() => router.delete(`companies/${company.id}`)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t p-4">
                            <Pagination links={companies.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
