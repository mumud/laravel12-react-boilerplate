import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { groupBy } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>App Modul</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.children ? (
                        <DropdownNavItem key={item.title} item={item} />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href!)} tooltip={{ children: item.title }}>
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function DropdownNavItem({ item }: { item: NavItem }) {
    const page = usePage();
    const isActive = item.children?.some((child) => page.url.startsWith(child.href ?? ''));
    const [open, setOpen] = useState(isActive);

    return (
        <>
            <SidebarMenuItem>
                <button
                    onClick={() => setOpen(!open)}
                    className={clsx(
                        'flex w-full items-center justify-between gap-2 rounded p-2 text-sm font-medium hover:bg-muted',
                        open && 'bg-muted',
                    )}
                >
                    <span className="flex items-center gap-2">
                        {item.icon && <item.icon size={16} />}
                        {item.title}
                    </span>
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
            </SidebarMenuItem>

            {open &&
                Object.entries(groupBy(item.children ?? [], (child) => child.group || '')).map(([groupName, groupItems]) => (
                    <div key={groupName} className="pl-4">
                        {groupName !== '' && (
                            <div className="mt-2 mb-1 pl-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{groupName}</div>
                        )}

                        {groupItems.map((child) => (
                            <SidebarMenuItem key={child.title} className="pl-2">
                                <SidebarMenuButton asChild isActive={page.url.startsWith(child.href!)} tooltip={{ children: child.title }}>
                                    <Link href={child.href!} prefetch>
                                        {child.icon && <child.icon size={14} />}
                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                ))}
        </>
    );
}
