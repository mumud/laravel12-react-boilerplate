import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    return (
        <div className="mt-4 flex justify-end">
            <nav className="inline-flex items-center space-x-1">
                {links.map((link, index) => {
                    const label = link.label.replace(/&laquo;|&raquo;/g, (match) => (match === '&laquo;' ? '←' : '→'));

                    return link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            className={cn(
                                'rounded border px-3 py-1 text-sm hover:bg-muted',
                                link.active && 'border-primary bg-primary text-white hover:bg-primary/90',
                            )}
                        >
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        </Link>
                    ) : (
                        <span key={index} className="cursor-not-allowed rounded border px-3 py-1 text-sm text-muted-foreground">
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        </span>
                    );
                })}
            </nav>
        </div>
    );
}
