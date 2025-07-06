import ActivityLog, { IActivity } from '@/components/activity-log';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IDepartment } from '@/types/department';
import { Head, useForm } from '@inertiajs/react';
import { SaveIcon, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Organization', href: '#!' },
    { title: 'Department', href: '/organizations/departments' },
    { title: 'Edit', href: '#!' },
];

export default function EditDepartment({ department, activities }: { department: IDepartment; activities: IActivity[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        code: department.code,
        description: department.description || '',
        status: department.status,
    });

    const handleConfirmSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit(); // lebih baik daripada .submit() karena memicu onSubmit
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('departments.update', department.id));
    };

    const [shiftApprovers, setShiftApprovers] = useState<string[]>([]);
    const [leaveApprovers, setLeaveApprovers] = useState<string[]>([]);
    const [overtimeApprovers, setOvertimeApprovers] = useState<string[]>([]);
    const [expenseApprovers, setExpenseApprovers] = useState<string[]>([]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Department" />
            <div className="flex flex-col gap-4 pb-4">
                <div className="flex items-center justify-between border-b px-4 py-2">
                    <div>
                        <h1 className="text-lg font-bold">
                            {department.code} - {department.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">Edit departments</p>
                    </div>
                    <ConfirmDialog
                        trigger={
                            <Button type="button" className="text-sm" disabled={processing}>
                                <SaveIcon className="h-4 w-4" /> Save Changes
                            </Button>
                        }
                        title="Save Changes"
                        description="Are you sure you want to save changes to this department?"
                        confirmText="Yes, Save"
                        onConfirm={handleConfirmSubmit}
                    />
                </div>

                <div className="flex flex-col gap-4 px-4 lg:flex-row">
                    <form ref={formRef} onSubmit={handleSubmit} className="w-full space-y-4 lg:w-2/3">
                        <div>
                            <h2 className="text-base font-semibold">Details</h2>
                            <p className="text-sm text-muted-foreground">Department informations detail.</p>
                            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Name</Label>
                                    <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Code</Label>
                                    <Input value={data.code} onChange={(e) => setData('code', e.target.value)} />
                                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Division</Label>
                                    <Input value={`[${department.division.code}] ${department.division.name}`} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-3">
                                    <Label>Description</Label>
                                    <Textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">Approvers</h2>
                            <p className="text-sm text-muted-foreground">The first Approver in the list will be set as the default Approver.</p>

                            <Tabs defaultValue="shift" className="pt-4">
                                <TabsList>
                                    <TabsTrigger value="shift">Shift</TabsTrigger>
                                    <TabsTrigger value="leave">Leave</TabsTrigger>
                                    <TabsTrigger value="overtime">Overtime</TabsTrigger>
                                    <TabsTrigger value="expense">Expense</TabsTrigger>
                                </TabsList>

                                <TabsContent value="shift">
                                    <ApproverTable title="Shift Request Approver" approvers={shiftApprovers} setApprovers={setShiftApprovers} />
                                </TabsContent>
                                <TabsContent value="leave">
                                    <ApproverTable title="Leave Approver" approvers={leaveApprovers} setApprovers={setLeaveApprovers} />
                                </TabsContent>
                                <TabsContent value="overtime">
                                    <ApproverTable title="Overtime Approver" approvers={overtimeApprovers} setApprovers={setOvertimeApprovers} />
                                </TabsContent>
                                <TabsContent value="expense">
                                    <ApproverTable title="Expense Approver" approvers={expenseApprovers} setApprovers={setExpenseApprovers} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </form>

                    <aside className="w-full space-y-4 lg:w-1/3">
                        <ActivityLog activities={activities} />
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

function ApproverTable({
    title,
    approvers,
    setApprovers,
}: {
    title: string;
    approvers: string[];
    setApprovers: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    return (
        <div className="space-y-2">
            <h2 className="font-medium">{title}</h2>
            <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                    <thead className="bg-muted">
                        <tr>
                            <th className="w-8 text-center">No.</th>
                            <th className="px-3 py-2 text-left">Approver *</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-4 text-center text-muted-foreground">
                                    No rows
                                </td>
                            </tr>
                        ) : (
                            approvers.map((value, index) => (
                                <tr key={index} className="border-t">
                                    <td className="text-center">{index + 1}</td>
                                    <td className="px-3 py-2">
                                        <Input
                                            value={value}
                                            onChange={(e) => setApprovers((prev) => prev.map((v, i) => (i === index ? e.target.value : v)))}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setApprovers((prev) => prev.filter((_, i) => i !== index))}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setApprovers([...approvers, ''])}>
                Add Row
            </Button>
        </div>
    );
}
