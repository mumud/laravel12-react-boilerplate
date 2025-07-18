import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse } from '@/types';
import { ICompany } from '@/types/company';
import { IPermissionFlags } from '@/types/permission';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type CompanyPagination = PaginatedResponse<ICompany>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'nav.organization', href: '#!' },
    { title: 'nav.company', href: '/companies' },
];

export default function Company() {
    const { t } = useLang();
    const { can, companies, filters } = usePage<{
        can: IPermissionFlags;
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

    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || '');
    const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction || 'asc');
    const [filterField, setFilterField] = useState(filters.filterField || '');
    const [filterOperator, setFilterOperator] = useState(filters.filterOperator || '');
    const [filterValue, setFilterValue] = useState(filters.filterValue || '');

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
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
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
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('company')} />
            <div className="flex flex-col gap-4">
                <PageHeader
                    title={t('company')}
                    subtitle={t('company.description')}
                    actions={
                        <Button size="sm" onClick={() => {}}>
                            <Plus className="mr-2 h-4 w-4" /> {t('company.add')}
                        </Button>
                    }
                />

                <div className="flex flex-col gap-4 px-4">
                    <DataTable
                        data={companies.data}
                        columns={[
                            { accessor: 'code', label: t('code'), sortable: true },
                            { accessor: 'name', label: t('name'), sortable: true },
                        ]}
                        sort={sort as keyof ICompany}
                        direction={direction}
                        onSort={handleSort}
                        getRowId={(row) => String(row.id)}
                        emptyMessage={t('no_companies_found')}
                        actions={(row) => (
                            <div className="flex gap-1">
                                {can.update && (
                                    <Link href={route('companies.edit', row.id)}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="h-4 w-4" /> Edit
                                        </Button>
                                    </Link>
                                )}
                                {can.delete && (
                                    <ConfirmDialog
                                        trigger={
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        }
                                        title={t('delete.company')}
                                        description={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
                                        confirmText={t('delete.confirm')}
                                        onConfirm={() => router.delete(`companies/${row.id}`)}
                                    />
                                )}
                            </div>
                        )}
                        search={search}
                        setSearch={setSearch}
                        onSearch={handleSearch}
                        onClearSearch={() => {
                            setSearch('');
                            router.get(route('companies.index'), {}, { preserveScroll: true });
                        }}
                        onReload={() => router.reload({ preserveUrl: true })}
                        filterField={filterField}
                        setFilterField={setFilterField}
                        filterOperator={filterOperator}
                        setFilterOperator={setFilterOperator}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        onClearFilter={() => {
                            setFilterField('');
                            setFilterOperator('');
                            setFilterValue('');
                            router.get(route('companies.index'), { search });
                        }}
                        filterActive={!!(filterField && filterOperator && filterValue)}
                    />
                    <Pagination links={companies.links} />
                </div>
            </div>
        </AppLayout>
    );
}
