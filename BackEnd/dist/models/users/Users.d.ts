export interface IUser {
    id?: string;
    username: string;
    password: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    role?: number;
    status?: number;
    created_at?: Date;
    updated_at?: Date;
}
export declare class Users implements IUser {
    id: string;
    username: string;
    password: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    role?: number;
    status?: number;
    created_at?: Date;
    updated_at?: Date;
    constructor({ id, username, password, name, address, phone, email, role, status, created_at, updated_at, }: IUser);
    private hashPassword;
    comparePassword(rawPassword: string): boolean;
}
//# sourceMappingURL=Users.d.ts.map