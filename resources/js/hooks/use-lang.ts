import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useLang() {
    const page = usePage<SharedData>();
    const locale = page.props.locale;
    const translations = page.props.translations;

    function t(key: string, fallback?: string): string {
        return translations[key] ?? fallback ?? key;
    }

    return {
        locale,
        t,
    };
}
