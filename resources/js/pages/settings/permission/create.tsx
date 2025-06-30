'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useModal } from '@/hooks/use-modal-store';
import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export const CreatePermission = () => {
    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === 'createPermission';
    const { data, setData, processing, errors, reset, post } = useForm({ name: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: () => {},
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
                    <DialogTitle className="text-xl font-bold">Create Permission</DialogTitle>
                    <DialogDescription className="text-zinc-500">Create your permission.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Input
                            className="w-full"
                            placeholder="Permission name"
                            value={data?.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Textarea
                            placeholder="Description"
                            className="w-full"
                            value={data?.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>
                    <DialogFooter>
                        <Button disabled={processing}>
                            <SaveIcon /> Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
