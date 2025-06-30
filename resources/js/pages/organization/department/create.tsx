'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { useModal } from '@/hooks/use-modal-store';
import { IDivision } from '@/types/division';
import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CreateDepartment = () => {
    const { t } = useLang();
    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === 'createDepartment';
    const [divisions, setDivisions] = useState<IDivision[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        division_id: '',
        name: '',
        code: '',
        description: '',
        status: 'active',
    });

    useEffect(() => {
        if (isModalOpen && divisions.length === 0) {
            fetch(route('divisions.options'))
                .then((res) => res.json())
                .then((data) => setDivisions(data.divisions));
        }
    }, [divisions, isModalOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('departments.store'), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="overflow-hidden bg-white p-4 text-black">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-xl font-semibold">{t('department.add.title')}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">{t('department.add.subtitle')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="col-span-2 flex flex-col space-y-2">
                            <Label>{t('department.name')}</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label>{t('department.code')}</Label>
                            <Input value={data.code} onChange={(e) => setData('code', e.target.value)} />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="col-span-2 flex flex-col space-y-2">
                            <Label>{t('division')}</Label>
                            <Popover modal>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full justify-between">
                                        {data.division_id
                                            ? `[${divisions.find((d) => String(d.id) === data.division_id)?.code}] ${divisions.find((d) => String(d.id) === data.division_id)?.name}`
                                            : t('division.select.placeholder')}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={t('search')} />
                                        <CommandEmpty>{t('no.results.found')}</CommandEmpty>
                                        <CommandGroup>
                                            {divisions.map((division) => (
                                                <CommandItem
                                                    key={division.id}
                                                    onSelect={() => setData('division_id', String(division.id))}
                                                    className="cursor-pointer"
                                                >
                                                    [{division.code}] {division.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {errors.division_id && <p className="text-sm text-red-500">{errors.division_id}</p>}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>{t('status')}</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">{t('status.active')}</SelectItem>
                                    <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>

                        <div className="col-span-3 flex flex-col space-y-2">
                            <Label>{t('description')}</Label>
                            <Textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            <SaveIcon className="h-4 w-4" /> {t('department.add.submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
