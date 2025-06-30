import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLang } from '@/hooks/use-lang';
import { useModal } from '@/hooks/use-modal-store';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedResponse } from '@/types';
import { IDepartment } from '@/types/department';
import { IPermissionFlags } from '@/types/permission';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type DepartmentPagination = PaginatedResponse<IDepartment>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'nav.organization', href: '#!' },
    { title: 'nav.department', href: '/departments' },
];

export default function Department() {
    const { t } = useLang();
    const { can, departments, filters } = usePage<{
        can: IPermissionFlags;
        departments: DepartmentPagination;
        filters: {
            search?: string;
            sort?: string;
            direction?: 'asc' | 'desc';
            filterField?: string;
            filterOperator?: string;
            filterValue?: string;
        };
    }>().props;
    const { onOpen } = useModal();

    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || '');
    const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction || 'asc');
    const [filterField, setFilterField] = useState(filters.filterField || '');
    const [filterOperator, setFilterOperator] = useState(filters.filterOperator || '');
    const [filterValue, setFilterValue] = useState(filters.filterValue || '');

    const toggleSelect = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== String(id)) : [...prev, String(id)]));
    };

    const toggleSelectAll = () => {
        if (selected.length === departments.data.length) {
            setSelected([]);
        } else {
            setSelected(departments.data.map((c) => String(c.id)));
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('departments.index'),
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
            route('departments.index'),
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
            <Head title={t('department')} />
            <div className="flex flex-col gap-4">
                <PageHeader
                    title={t('department')}
                    subtitle={t('department.description')}
                    actions={
                        <Button size="sm" onClick={() => onOpen('createDepartment')}>
                            <Plus className="mr-2 h-4 w-4" /> {t('department.add')}
                        </Button>
                    }
                />

                <div className="flex flex-col gap-4 px-4">
                    <DataTable
                        data={departments.data}
                        columns={[
                            { accessor: 'code', label: t('code'), sortable: true },
                            { accessor: 'name', label: t('name'), sortable: true },
                            {
                                accessor: 'division',
                                label: t('division'),
                                sortable: true,
                                render: (row) => `[${row.division?.code}] ${row.division?.name}`,
                            },
                            { accessor: 'description', label: t('description'), sortable: true },
                        ]}
                        enableSelection
                        selected={selected}
                        onSelect={toggleSelect}
                        onSelectAll={toggleSelectAll}
                        sort={sort as keyof IDepartment}
                        direction={direction}
                        onSort={handleSort}
                        getRowId={(row) => String(row.id)}
                        emptyMessage="No departments found."
                        actions={(row) => (
                            <div className="flex gap-1">
                                {can.update && (
                                    <Link href={route('departments.edit', row.id)}>
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
                                        title="Delete Department"
                                        description={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
                                        confirmText="Yes, Delete"
                                        onConfirm={() => router.delete(`departments/${row.id}`)}
                                    />
                                )}
                            </div>
                        )}
                        search={search}
                        setSearch={setSearch}
                        onSearch={handleSearch}
                        onClearSearch={() => {
                            setSearch('');
                            router.get(route('departments.index'), {}, { preserveScroll: true });
                        }}
                        onReload={() => router.reload({ preserveUrl: true })}
                        filterFields={[
                            {
                                label: t('code'),
                                value: 'code',
                            },
                            {
                                label: t('name'),
                                value: 'name',
                            },
                            {
                                label: t('division.code'),
                                value: 'division.code',
                            },
                            {
                                label: t('division.name'),
                                value: 'division.name',
                            },
                        ]}
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
                            router.get(route('departments.index'), { search });
                        }}
                        filterActive={!!(filterField && filterOperator && filterValue)}
                        bulkDropdown={
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => console.log('Export selected')}>
                                        <FileText className="h-4 w-4" /> {t('export')}
                                    </DropdownMenuItem>
                                    {can.delete && selected.length > 0 && (
                                        <DropdownMenuItem asChild>
                                            <ConfirmDialog
                                                title="Delete Selected"
                                                description={`Are you sure you want to delete ${selected.length} items?`}
                                                confirmText="Yes, Delete"
                                                onConfirm={() => {
                                                    selected.forEach((id) => {
                                                        router.delete(`departments/${id}`, { preserveScroll: true });
                                                    });
                                                    setSelected([]);
                                                }}
                                                trigger={
                                                    <div className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-red-500 transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground">
                                                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                        {t('delete.selected')}
                                                    </div>
                                                }
                                            />
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        }
                    />
                    <Pagination links={departments.links} />
                </div>
            </div>
        </AppLayout>
    );
}
