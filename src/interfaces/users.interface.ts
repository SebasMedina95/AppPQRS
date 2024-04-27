import { Metadata } from "./common/metadata.interface";

export interface IUser {
    id?: number;
    typeDocument: string;
    document: string;
    fullName: string;
    email: string;
    emailValidated?: boolean;
    password?: string;
    roles: string[];
    img?: string | null;
    address?: string | null;
    phone?: string | null;
    cellPhone?: string | null;
    description?: string | null;
    createDateAt?: Date | null;
    token?: string;
}

export interface IUserNoToken {
    id?: number;
    typeDocument: string;
    document: string;
    fullName: string;
    email: string;
    emailValidated?: boolean;
    password?: string;
    roles: string[];
    img?: string | null;
    address?: string | null;
    phone?: string | null;
    cellPhone?: string | null;
    description?: string | null;
    createDateAt?: Date | null;
}

export interface IUserPaginated {
    users: IUserNoToken[],
    metadata?: Metadata,
}
