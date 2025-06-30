import ModalProvider from '@/components/providers/modal-providers';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { CustomPageProps, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { props: pageProps } = usePage<CustomPageProps>();

    useEffect(() => {
        const flash = pageProps.flash;

        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.info) toast(flash.info);
        if (flash?.warning && toast.warning) toast.warning(flash.warning);
    }, [pageProps.flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <>
                {children}
                <ModalProvider />
                <Toaster position="top-center" closeButton duration={2000} />
            </>
        </AppLayoutTemplate>
    );
};
