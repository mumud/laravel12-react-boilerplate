import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { SearchTrigger } from './search-trigger';

const notifications = [
    { id: 1, title: 'Absence request approved', time: '2h ago' },
    { id: 2, title: 'New payslip available', time: '1d ago' },
    { id: 3, title: 'Upcoming evaluation', time: '3d ago' },
];

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Left: Sidebar toggle & breadcrumb */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
                <TooltipProvider delayDuration={0}>
                    <div className="flex items-center gap-2">
                        <SearchTrigger />
                    </div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="size-5 opacity-80" />
                                        {notifications.length > 0 && (
                                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"></span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-72 p-0">
                                    <div className="border-b p-2 text-sm font-semibold text-muted-foreground">Notifications</div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="cursor-pointer border-b p-3 hover:bg-muted">
                                                <div className="text-sm text-foreground">{notif.title}</div>
                                                <div className="text-xs text-muted-foreground">{notif.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {notifications.length === 0 && <div className="p-3 text-sm text-muted-foreground">No notifications</div>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent>Notifications</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-9 rounded-full p-1">
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
