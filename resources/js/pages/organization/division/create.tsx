'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { useModal } from '@/hooks/use-modal-store';
import { ICompany } from '@/types/company';
import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CreateDivision = () => {
    const { t } = useLang();
    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === 'createDivision';
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        company_id: '',
        name: '',
        code: '',
        description: '',
        status: 'active',
    });

    useEffect(() => {
        if (isModalOpen && companies.length === 0) {
            fetch(route('companies.options'))
                .then((res) => res.json())
                .then((data) => setCompanies(data.companies));
        }
    }, [companies, isModalOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('divisions.store'), {
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
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="overflow-hidden bg-white p-4 text-black">
                    <DialogHeader className="pt-6">
                        <DialogTitle className="text-xl font-semibold">{t('division.add.title')}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">{t('division.add.subtitle')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="col-span-2 flex flex-col space-y-2">
                                <Label>{t('division.name')}</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label>{t('division.code')}</Label>
                                <Input value={data.code} onChange={(e) => setData('code', e.target.value)} />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>
                            <div className="col-span-2 flex flex-col space-y-2">
                                <Label>{t('company')}</Label>
                                <Select value={data.company_id} onValueChange={(value) => setData('company_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('company.select.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={String(company.id)}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.company_id && <p className="text-sm text-red-500">{errors.company_id}</p>}
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
                                <SaveIcon className="h-4 w-4" /> {t('division.add.submit')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
