import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Organization', href: '#!' },
    { title: 'Company', href: '/organization/companies' },
    { title: 'Create', href: '#!' },
];

export default function CompanyCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies - Create" />
            <div className="flex flex-col gap-4 p-4"></div>
        </AppLayout>
    );
}
