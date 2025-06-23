'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useModal } from '@/hooks/use-modal-store';
import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { Toaster } from 'sonner';
import { Input } from '../ui/input';

export const EditPermissionModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { permission } = data;
    const isModalOpen = isOpen && type === 'editPermission';
    const form = useForm({ name: permission?.name, description: permission?.description });
    const isLoading = false;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('permissions.update', permission?.id), {
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

    console.log('mounted');

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="overflow-hidden bg-white p-0 text-black">
                    <DialogHeader className="px-6 pt-8">
                        <DialogTitle className="text-center text-2xl font-bold">Edit Permission</DialogTitle>
                        <DialogDescription className="text-center text-zinc-500">Edit your permission.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <div className="space-y-6 px-6">
                            <Input
                                className="w-full"
                                placeholder="Permission name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                            <Textarea
                                placeholder="Description"
                                className="w-full"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading}>
                                <SaveIcon /> Save Change
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Toaster position="top-center" closeButton duration={3000} />
        </>
    );
};
