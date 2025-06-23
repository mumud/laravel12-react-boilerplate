import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse } from '@/types';
import { ICompany } from '@/types/company';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Pencil, PlusIcon, RotateCw, Trash2 } from 'lucide-react';
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
        filters: { search?: string; sort?: string; direction?: 'asc' | 'desc' };
    }>().props;

    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || '');
    const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction || 'asc');

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
        router.get(route('companies.index'), { search, sort, direction }, { preserveScroll: true });
    };

    const handleSort = (field: string) => {
        const newDirection = sort === field && direction === 'asc' ? 'desc' : 'asc';
        setSort(field);
        setDirection(newDirection);
        router.get(route('companies.index'), { search, sort: field, direction: newDirection }, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this company?')) {
            router.delete(`/companies/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Company</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.reload({ preserveUrl: true })}>
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Link href="companies/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" /> Add Company
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search company..."
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <Button type="submit" variant="outline" size="sm">
                        Search
                    </Button>
                </form>

                {selected.length > 0 && (
                    <div className="flex items-center justify-between rounded border bg-muted px-4 py-2 text-sm">
                        <div>{selected.length} selected</div>
                        <div className="space-x-2">
                            <Button size="sm" variant="destructive">
                                <Trash2 className="mr-1 h-4 w-4" /> Delete Selected
                            </Button>
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
                                                <Link href={`/companies/${company.id}/edit`}>
                                                    <Button size="sm" variant="outline">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDelete(company.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
