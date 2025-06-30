'use client';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useModal } from '@/hooks/use-modal-store';
import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Input } from '../../../components/ui/input';

export const EditPermission = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { permission } = data;
    const isModalOpen = isOpen && type === 'editPermission';
    const {
        errors,
        setData,
        processing,
        reset,
        put,
        data: formData,
    } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = () => {
        put(route('permissions.update', permission?.id), {
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

    useEffect(() => {
        if (permission) {
            setData({
                name: permission.name,
                description: permission.description,
            });
        }
    }, [permission, setData]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="overflow-hidden bg-white p-4 text-black">
                <DialogHeader className="pt-6">
                    <DialogTitle className="text-xl font-bold">Edit Permission</DialogTitle>
                    <DialogDescription className="text-zinc-500">Edit your permission.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Input
                            className="w-full"
                            placeholder="Permission name"
                            value={formData?.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <Textarea
                            placeholder="Description"
                            className="w-full"
                            value={formData?.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>
                    <DialogFooter>
                        <ConfirmDialog
                            trigger={
                                <Button type="button" disabled={processing}>
                                    <SaveIcon className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            }
                            title="Confirm Changes"
                            description="Are you sure you want to save these changes?"
                            confirmText="Yes, Save"
                            onConfirm={handleSubmit}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
