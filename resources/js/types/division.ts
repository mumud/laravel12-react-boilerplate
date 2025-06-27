import { ICompany } from './company';

export interface IDivision {
    id: number;
    name: string;
    code: string;
    status: string;
    description: string;
    company: ICompany;
    created_at: string;
    updated_at: string;
}
