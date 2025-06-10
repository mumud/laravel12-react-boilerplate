import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useModal } from '@/hooks/use-modal-store';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { IPermission } from '@/types/permission';
import { Head, useForm, usePage } from '@inertiajs/react';
import { EditIcon, PlusIcon, SaveIcon, TrashIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '#!' },
    { title: 'Permission', href: '/permissions' },
];

export default function Permission() {
    const { onOpen } = useModal();
    const { permissions, flash, errors } = usePage<{
        permissions: IPermission[];
        flash: { success: string; error: string };
        errors: { name: string; description: string };
    }>().props;

    const [editingId, setEditingId] = useState<number | null>(null);
    const form = useForm({ name: '', description: '' });

    const handleUpdate = (id: number) => {
        form.put(route('permissions.update', id), {
            onSuccess: () => {
                if (flash.success) toast.success(flash.success);

                setEditingId(null);
                form.reset();
            },
            onError: () => {
                if (flash.error) toast.error(flash.error);
                if (errors.name) toast.error(errors.name);
                if (errors.description) toast.error(errors.description);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure, you want to delete?')) {
            form.delete(route('permissions.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    if (flash.success) toast.success(flash.success);
                },
                onError: () => {
                    if (flash.error) toast.error(flash.error);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Permissions</h1>
                    <Button onClick={() => onOpen('createPermission')}>
                        <PlusIcon /> Add Permission
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30%]">Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[20%]">Guard Name</TableHead>
                            <TableHead className="w-10 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    {editingId === p.id ? (
                                        <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                    ) : (
                                        p.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === p.id ? (
                                        <Input value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                                    ) : (
                                        p.description
                                    )}
                                </TableCell>
                                <TableCell>{p.guard_name}</TableCell>
                                <TableCell className="flex gap-2">
                                    {editingId === p.id ? (
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleUpdate(p.id)}>
                                                <SaveIcon /> Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    form.reset();
                                                }}
                                            >
                                                <XIcon /> Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingId(p.id);
                                                    form.setData('name', p.name);
                                                    form.setData('description', p.description);
                                                }}
                                            >
                                                <EditIcon /> Edit
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleDelete(p.id)}>
                                                <TrashIcon /> Delete
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Toaster position="top-center" closeButton duration={3000} />
        </AppLayout>
    );
}
