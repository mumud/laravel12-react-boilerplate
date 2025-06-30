import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
    return (
        <div className="border-b">
            <div className="flex items-center justify-between px-4 py-1">
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{title}</h1>
                    {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
                </div>
                {actions && <div>{actions}</div>}
            </div>
        </div>
    );
};
