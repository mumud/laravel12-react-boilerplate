'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { Toaster } from 'sonner';
import { Input } from '../ui/input';

export const CreatePermissionModal = () => {
    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === 'createPermission';
    const form = useForm({ name: '', description: '' });
    const isLoading = false;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('permissions.store'), {
            onSuccess: () => {
                form.reset();
                onClose();
            },
            onError: () => {},
        });
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="overflow-hidden bg-white p-0 text-black">
                    <DialogHeader className="px-6 pt-8">
                        <DialogTitle className="text-center text-2xl font-bold">Create Permission</DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">
                            Give your permission a name and fill the description.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <div className="space-y-6 px-6">
                            <Input
                                className="w-full"
                                placeholder="Permission name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            <Input
                                className="w-full"
                                placeholder="Description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading}>
                                <SaveIcon /> Save Permission
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Toaster position="top-center" closeButton duration={3000} />
        </>
    );
};
