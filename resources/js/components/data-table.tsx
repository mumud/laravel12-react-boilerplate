import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLang } from '@/hooks/use-lang';
import { ArrowDown, ArrowUp, Filter, RotateCw, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Column<T> {
    accessor: keyof T;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    getRowId: (row: T) => string;
    selected?: string[];
    onSelect?: (id: string) => void;
    onSelectAll?: () => void;
    enableSelection?: boolean;
    sort?: keyof T;
    direction?: 'asc' | 'desc';
    onSort?: (key: keyof T) => void;
    emptyMessage?: string;
    actions?: (row: T) => React.ReactNode;
    search: string;
    setSearch: (value: string) => void;
    onSearch: (e: React.FormEvent) => void;
    onClearSearch: () => void;
    onReload?: () => void;
    filterField: string;
    setFilterField: (val: string) => void;
    filterOperator: string;
    setFilterOperator: (val: string) => void;
    filterValue: string;
    setFilterValue: (val: string) => void;
    onClearFilter: () => void;
    filterFields?: { label: string; value: string }[];
    filterActive?: boolean;
    bulkDropdown?: React.ReactNode;
}

const defaultFilterFields = [
    { label: 'Name', value: 'name' },
    { label: 'Code', value: 'code' },
];

export default function DataTable<T>({
    data,
    columns,
    getRowId,
    selected = [],
    onSelect,
    onSelectAll,
    enableSelection = false,
    sort,
    direction,
    onSort,
    emptyMessage = 'No data found.',
    actions,
    search,
    setSearch,
    onSearch,
    onClearSearch,
    onReload,
    filterField,
    setFilterField,
    filterOperator,
    setFilterOperator,
    filterValue,
    setFilterValue,
    onClearFilter,
    filterFields = defaultFilterFields,
    filterActive = false,
    bulkDropdown,
}: DataTableProps<T>) {
    const { t } = useLang();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const allSelected = enableSelection && data.length > 0 && selected.length === data.length;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <form onSubmit={onSearch} className="relative w-full max-w-sm">
                    <Search className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`${t('search.by')} ${columns.map((c) => t(c.label.toLocaleLowerCase())).join(', ')}`}
                        className="pl-9"
                    />
                    <button type="submit" hidden />
                    {search && (
                        <Button size="icon" variant="link" className="absolute top-1/2 right-0 -translate-y-1/2" onClick={onClearSearch}>
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </form>

                <div className="flex items-center gap-2">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4" /> {t('filter')}
                                {filterActive && (
                                    <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">1</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[500px] space-y-2">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSearch(e);
                                    setIsFilterOpen(false);
                                }}
                                className="flex flex-col gap-4 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium">Field</label>
                                        <Select value={filterField} onValueChange={setFilterField}>
                                            <SelectTrigger className="w-[120px]" size="sm">
                                                <SelectValue placeholder={t('filter.field.placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterFields.map((field) => (
                                                    <SelectItem key={field.value} value={field.value}>
                                                        {t(field.label)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium">Operator</label>
                                        <Select value={filterOperator} onValueChange={setFilterOperator}>
                                            <SelectTrigger className="w-[120px]" size="sm">
                                                <SelectValue placeholder={t('filter.operator.placeholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="equals">{t('equals')}</SelectItem>
                                                <SelectItem value="contains">{t('contains')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-1">
                                        <label className="font-medium">{t('filter.value')}</label>
                                        <Input
                                            type="text"
                                            value={filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            className="w-full rounded-md border px-2 py-1 shadow-xs"
                                            placeholder={t('filter.value.placeholder')}
                                        />
                                        <input type="submit" hidden />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onClearFilter();
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        {t('filter.clear')}
                                    </Button>
                                    <Button type="submit" size="sm">
                                        {t('filter.apply')}
                                    </Button>
                                </div>
                            </form>
                        </PopoverContent>
                    </Popover>

                    {onReload && (
                        <Button variant="outline" size="sm" onClick={onReload}>
                            <RotateCw className="h-4 w-4" />
                        </Button>
                    )}

                    {bulkDropdown && <div>{bulkDropdown}</div>}
                </div>
            </div>
            <Table className="w-full border-b text-sm">
                <TableHeader className="bg-muted text-xs text-muted-foreground uppercase">
                    <TableRow>
                        {enableSelection && (
                            <TableHead className="w-[50px] p-3 text-center">
                                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
                            </TableHead>
                        )}
                        {columns.map((col) => (
                            <TableHead
                                key={String(col.accessor)}
                                className="cursor-pointer p-3 text-left font-semibold"
                                onClick={() => col.sortable && onSort?.(col.accessor)}
                            >
                                {col.label}{' '}
                                {sort === col.accessor &&
                                    (direction === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />)}
                            </TableHead>
                        ))}
                        {actions && <TableHead className="w-[100px] p-3 text-center font-semibold">{t('action')}</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + (enableSelection ? 2 : 1)} className="p-6 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => {
                            const id = getRowId(row);
                            return (
                                <TableRow key={id} className="border-b transition-colors hover:bg-muted/50">
                                    {enableSelection && (
                                        <TableCell className="p-3 text-center">
                                            <Checkbox checked={selected.includes(id)} onCheckedChange={() => onSelect?.(id)} />
                                        </TableCell>
                                    )}
                                    {columns.map((col) => (
                                        <TableCell key={String(col.accessor)}>
                                            {col.render ? col.render(row) : (row[col.accessor] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                    {actions && <TableCell>{actions(row)}</TableCell>}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
