import { useEffect, useState } from 'react';
import { CreatePermissionModal } from '../modals/create-permission-modal';
import { EditPermissionModal } from '../modals/edit-permission-modal';

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreatePermissionModal />
            <EditPermissionModal />
        </>
    );
};

export default ModalProvider;
