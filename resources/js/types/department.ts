import { IDivision } from './division';

export interface IDepartment {
    id: number;
    name: string;
    code: string;
    status: string;
    description: string;
    division: IDivision;
    created_at: string;
    updated_at: string;
}
