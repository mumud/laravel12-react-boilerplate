'use client';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useCommandPalette } from '@/hooks/use-command-palette';
import { router } from '@inertiajs/react';
import { Briefcase, LayoutGrid, Users2 } from 'lucide-react';
import { useEffect } from 'react';

export function CommandPalette() {
    const { open, setOpen } = useCommandPalette();

    // Shortcut Ctrl+K or Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                useCommandPalette.getState().toggle();
            }
        };
        window.addEventListener('keydown', down);
        return () => window.removeEventListener('keydown', down);
    }, []);

    const menuItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: <LayoutGrid className="mr-2 h-4 w-4" />,
        },
        {
            title: 'Employees',
            href: '/employee/data',
            icon: <Users2 className="mr-2 h-4 w-4" />,
        },
        {
            title: 'Divisions',
            href: '/organization/division',
            icon: <Briefcase className="mr-2 h-4 w-4" />,
        },
    ];

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    {menuItems.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => {
                                setOpen(false);
                                router.visit(item.href);
                            }}
                        >
                            {item.icon}
                            {item.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
