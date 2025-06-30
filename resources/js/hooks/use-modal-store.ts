import { IDepartment } from '@/types/department';
import { IDivision } from '@/types/division';
import { IPermission } from '@/types/permission';
import { create } from 'zustand';

export type ModalType = 'createPermission' | 'editPermission' | 'createDivision' | 'createDepartment';

interface ModalData {
    permission?: IPermission;
    division?: IDivision;
    department?: IDepartment;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type: ModalType, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));
