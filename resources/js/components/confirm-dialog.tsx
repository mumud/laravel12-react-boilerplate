'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { ReactNode, useState } from 'react';

type ConfirmDialogProps = {
    title?: string;
    description?: string;
    trigger: ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
};

export default function ConfirmDialog({
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    trigger,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
}: ConfirmDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            onConfirm();
                            setOpen(false);
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
