import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal-store';
import AppLayout from '@/layouts/app-layout';
import { PaginatedResponse, type BreadcrumbItem } from '@/types';
import { IPermission, IPermissionFlags } from '@/types/permission';
import { Head, router, usePage } from '@inertiajs/react';
import { EditIcon, PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

type PermissionPagination = PaginatedResponse<IPermission>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '#!' },
    { title: 'Permission', href: '/permissions' },
];

export default function Permission() {
    const { can, permissions, filters } = usePage<{
        can: IPermissionFlags;
        permissions: PermissionPagination;
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

    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || '');
    const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction || 'asc');
    const [filterField, setFilterField] = useState(filters.filterField || '');
    const [filterOperator, setFilterOperator] = useState(filters.filterOperator || '');
    const [filterValue, setFilterValue] = useState(filters.filterValue || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('permissions.index'),
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
            route('permissions.index'),
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
            <Head title="Permission" />
            <div className="flex flex-col gap-4">
                <PageHeader
                    title="Permission"
                    subtitle="Manage permissions"
                    actions={
                        <Button size="sm" onClick={() => onOpen('createPermission')}>
                            <PlusIcon className="h-4 w-4" /> Add Permission
                        </Button>
                    }
                />

                <div className="flex flex-col gap-4 px-4">
                    <DataTable
                        data={permissions.data}
                        columns={[
                            { label: 'Name', accessor: 'name', sortable: true },
                            { label: 'Description', accessor: 'description', sortable: true },
                            { label: 'Guard Name', accessor: 'guard_name', sortable: true },
                        ]}
                        sort={sort as keyof IPermission}
                        direction={direction}
                        onSort={handleSort}
                        getRowId={(row) => String(row.id)}
                        emptyMessage="No permissions found."
                        actions={(item) => (
                            <div className="flex gap-2">
                                {can.update && (
                                    <Button size="sm" variant="outline" onClick={() => onOpen('editPermission', { permission: item })}>
                                        <EditIcon /> Edit
                                    </Button>
                                )}
                                {can.delete && (
                                    <ConfirmDialog
                                        trigger={
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        }
                                        title="Delete Permission"
                                        description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
                                        confirmText="Yes, Delete"
                                        onConfirm={() => router.delete(`permissions/${item.id}`)}
                                    />
                                )}
                            </div>
                        )}
                        search={search}
                        setSearch={setSearch}
                        onSearch={handleSearch}
                        onClearSearch={() => {
                            setSearch('');
                            router.get(route('permissions.index'), {}, { preserveScroll: true });
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
                            router.get(route('permissions.index'), { search });
                        }}
                        filterActive={!!(filterField && filterOperator && filterValue)}
                    />
                    <Pagination links={permissions.links} />
                </div>
            </div>
        </AppLayout>
    );
}
