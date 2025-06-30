import { useEffect, useState } from 'react';

import { CreateDepartment } from '@/pages/organization/department/create';
import { CreateDivision } from '@/pages/organization/division/create';
import { CreatePermission } from '@/pages/settings/permission/create';
import { EditPermission } from '@/pages/settings/permission/edit';

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreatePermission />
            <EditPermission />
            <CreateDivision />
            <CreateDepartment />
        </>
    );
};

export default ModalProvider;
