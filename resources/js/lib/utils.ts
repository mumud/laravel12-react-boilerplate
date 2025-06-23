import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function groupBy<T>(arr: T[], keyGetter: (item: T) => string): Record<string, T[]> {
    return arr.reduce(
        (result, item) => {
            const key = keyGetter(item);
            result[key] = result[key] || [];
            result[key].push(item);
            return result;
        },
        {} as Record<string, T[]>,
    );
}
