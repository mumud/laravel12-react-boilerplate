import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useLang } from '@/hooks/use-lang';
import { Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Building2,
    CalendarCheck2,
    ChevronRight,
    ClipboardList,
    DockIcon,
    FileText,
    FileUser,
    HandHelping,
    HelpCircle,
    LandPlot,
    LayoutGrid,
    ListCheck,
    ListCollapse,
    Network,
    Settings,
    Sheet,
    ShieldCheck,
    Star,
    UserCog,
    Users2,
    UserSearch,
    Wallet,
} from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { t } = useLang();

    const mainNavItems = useMemo(
        () => [
            {
                title: t('nav.dashboard'),
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: t('nav.organization'),
                icon: Building2,
                children: [
                    { title: t('nav.company'), href: '/organizations/companies', icon: ChevronRight },
                    { title: t('nav.branch'), href: '/organizations/branches', icon: ChevronRight },
                    { title: t('nav.division'), href: '/organizations/divisions', icon: ChevronRight },
                    { title: t('nav.department'), href: '/organizations/departments', icon: ChevronRight },
                    { title: t('nav.section'), href: '/organizations/sections', icon: ChevronRight },
                    { title: t('nav.sub_section'), href: '/organizations/sub-sections', icon: ChevronRight },
                    { title: t('nav.position'), href: '/organizations/positions', icon: ChevronRight },
                    { title: t('nav.job_level'), href: '/organizations/job-levels', icon: ChevronRight },
                    { title: t('nav.cost_center'), href: '/organizations/cost-centers', icon: ChevronRight },
                    { title: t('nav.cost_group'), href: '/organizations/cost-groups', icon: ChevronRight },
                    { title: t('nav.structure'), href: '/organizations/structures', icon: Network },
                ],
            },
            {
                title: t('nav.employee'),
                icon: Users2,
                children: [
                    { title: t('nav.employee_data'), href: '/employee/data', icon: Users2 },
                    { title: t('nav.mutation'), href: '/employee/mutation', icon: ArrowLeftRight },
                    { title: t('nav.employee_report'), href: '/employee/employee-report', icon: Sheet },
                    { title: t('nav.mutation_report'), href: '/employee/mutation-report', icon: Sheet },
                ],
            },
            {
                title: t('nav.attendance'),
                icon: CalendarCheck2,
                children: [
                    { title: t('nav.absence'), href: '/attendance/absence', icon: CalendarCheck2 },
                    { title: t('nav.overtime'), href: '/attendance/overtime', icon: CalendarCheck2 },
                ],
            },
            {
                title: t('nav.payroll'),
                icon: Wallet,
                children: [
                    { title: t('nav.payslip'), href: '/payroll/payslip', icon: Wallet },
                    { title: t('nav.components'), href: '/payroll/components', icon: Wallet },
                ],
            },
            {
                title: t('nav.reimbursement'),
                icon: FileText,
                children: [{ title: t('nav.reimbursement_data'), href: '/reimbursement/data', icon: FileText }],
            },
            {
                title: t('nav.apraisal'),
                icon: Star,
                children: [{ title: t('nav.kpi'), href: '/evaluation/kpi', icon: Star }],
            },
            {
                title: t('nav.recruitment'),
                icon: UserSearch,
                children: [
                    { title: t('nav.staffing_plan'), href: '/recruitment/staffing-plan', icon: LandPlot },
                    { title: t('nav.job_requisition'), href: '/recruitment/job-requisition', icon: ListCollapse },
                    { title: t('nav.job_vacancy'), href: '/recruitment/job-vacancy', icon: ListCheck },
                    { title: t('nav.job_application'), href: '/recruitment/job-application', icon: FileUser },
                    { title: t('nav.job_offer'), href: '/recruitment/job-offer', icon: HandHelping },
                    { title: t('nav.job_interview'), href: '/recruitment/job-interview', icon: ClipboardList },
                ],
            },
            {
                title: t('nav.settings'),
                icon: Settings,
                children: [
                    { title: t('nav.role'), href: '/settings/roles', icon: UserCog },
                    { title: t('nav.permission'), href: '/settings/permissions', icon: ShieldCheck },
                ],
            },
        ],
        [t],
    );

    const footerNavItems = useMemo(
        () => [
            {
                title: t('nav.help_center'),
                href: '/#!',
                icon: HelpCircle,
            },
            {
                title: t('nav.documentation'),
                href: '/#!',
                icon: DockIcon,
            },
        ],
        [t],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/* <NavUser /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
