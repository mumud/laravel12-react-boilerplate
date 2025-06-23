import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
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
import AppLogo from './app-logo';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Organization',
        icon: Building2,
        children: [
            { title: 'Company', href: '/organization/companies', icon: ChevronRight },
            { title: 'Division', href: '/organization/divisions', icon: ChevronRight },
            { title: 'Department', href: '/organization/departments', icon: ChevronRight },
            { title: 'Section', href: '/organization/sections', icon: ChevronRight },
            { title: 'Sub Section', href: '/organization/sub-sections', icon: ChevronRight },
            { title: 'Position', href: '/organization/positions', icon: ChevronRight },
            { title: 'Job Level', href: '/organization/job-levels', icon: ChevronRight },
            { title: 'Cost Center', href: '/organization/cost-centers', icon: ChevronRight },
            { title: 'Cost Group', href: '/organization/cost-groups', icon: ChevronRight },
            { title: 'Structure', href: '/organization/structures', icon: Network },
        ],
    },
    {
        title: 'Employee',
        icon: Users2,
        children: [
            {
                title: 'Employee Data',
                href: '/employee/data',
                icon: Users2,
                group: 'General',
            },
            {
                title: 'Mutation',
                href: '/employee/mutation',
                icon: ArrowLeftRight,
                group: 'General',
            },
            {
                title: 'Employee Report',
                href: '/employee/employee-report',
                icon: Sheet,
                group: 'Reports',
            },
            {
                title: 'Mutation Report',
                href: '/employee/mutation-report',
                icon: Sheet,
                group: 'Reports',
            },
        ],
    },
    {
        title: 'Attendance',
        icon: CalendarCheck2,
        children: [
            { title: 'Absence', href: '/attendance/absence', icon: CalendarCheck2 },
            { title: 'Overtime', href: '/attendance/overtime', icon: CalendarCheck2 },
        ],
    },
    {
        title: 'Payroll',
        icon: Wallet,
        children: [
            { title: 'Payslip', href: '/payroll/payslip', icon: Wallet },
            { title: 'Components', href: '/payroll/components', icon: Wallet },
        ],
    },
    {
        title: 'Reimbursement',
        icon: FileText,
        children: [{ title: 'Reimbursement Data', href: '/reimbursement/data', icon: FileText }],
    },
    {
        title: 'Apraisal',
        icon: Star,
        children: [{ title: 'KPI', href: '/evaluation/kpi', icon: Star }],
    },
    {
        title: 'Recruitment',
        icon: UserSearch,
        children: [
            { title: 'Staffing Plan', href: '/recruitment/staffing-plan', icon: LandPlot },
            { title: 'Job Requisition', href: '/recruitment/job-requisition', icon: ListCollapse },
            { title: 'Job Vacancy', href: '/recruitment/job-vacancy', icon: ListCheck },
            { title: 'Job Application', href: '/recruitment/job-application', icon: FileUser },
            { title: 'Job Offer', href: '/recruitment/job-offer', icon: HandHelping },
            { title: 'Job Interview', href: '/recruitment/job-interview', icon: ClipboardList },
        ],
    },
    {
        title: 'Settings',
        icon: Settings,
        children: [
            { title: 'Role', href: '/settings/roles', icon: UserCog },
            { title: 'Permission', href: '/settings/permissions', icon: ShieldCheck },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Help Center',
        href: '/#!',
        icon: HelpCircle,
    },
    {
        title: 'Documentation',
        href: '/#!',
        icon: DockIcon,
    },
];

export function AppSidebar() {
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
