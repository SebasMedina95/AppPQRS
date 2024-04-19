
export interface IUser {
    id?: number;
    typeDocument: string;
    document: string;
    fullName: string;
    email: string;
    emailValidated?: boolean;
    password?: string;
    img?: string | null;
    address?: string | null;
    phone?: string | null;
    cellPhone?: string | null;
    description?: string | null;
    token?: string;
}
