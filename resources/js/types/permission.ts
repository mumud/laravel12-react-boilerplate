export interface IPermission {
    id: number;
    name: string;
    description: string;
    guard_name: string;
}

export interface IPermissionFlags {
    create: boolean;
    delete: boolean;
    view: boolean;
    update: boolean;
}
