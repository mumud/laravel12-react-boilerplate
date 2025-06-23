import { Button } from '@/components/ui/button';
import { useCommandPalette } from '@/hooks/use-command-palette';
import { Search } from 'lucide-react';

export function SearchTrigger() {
    const handleClick = () => useCommandPalette.getState().setOpen(true);

    return (
        <>
            {/* Mobile (icon only) */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleClick}>
                <Search className="size-5 opacity-80" />
                <span className="sr-only">Search</span>
            </Button>

            {/* Desktop (input style) */}
            <Button variant="outline" className="hidden h-9 w-60 justify-start gap-2 px-3 text-muted-foreground md:flex" onClick={handleClick}>
                <Search className="h-4 w-4 opacity-70" />
                <span className="text-sm">Search anything...</span>
                <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Ctrl K</kbd>
            </Button>
        </>
    );
}
