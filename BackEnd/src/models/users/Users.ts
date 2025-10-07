import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface IUser {
  id?: string; // UUID dạng string
  username: string;
  password: string; // Mật khẩu gốc, sẽ hash khi tạo
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  role?: number; // 1 = admin, 2 = manager, 3 = customer
  status?: number; // 0 = active, 1 = inactive
  created_at?: Date;
  updated_at?: Date;
}

export class Users implements IUser {
  id: string;
  username: string;
  password: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  role?: number;
  status?: number; // 0 = active, 1 = inactive
  created_at?: Date;
  updated_at?: Date;

  constructor({
    id,
    username,
    password,
    name,
    address,
    phone,
    email,
    role,
    status,
    created_at,
    updated_at,
  }: IUser) {
    this.id = id || randomUUID(); // nếu chưa có id → tự sinh UUID
    this.username = username;
    this.password = this.hashPassword(password); // tự động hash khi tạo
    this.name = name!;
    this.address = address!;
    this.phone = phone!;
    this.email = email!;
    this.role = role ?? 3; // mặc định 3: khách hàng
    this.status = status ?? 0; // mặc định 1: hoạt động
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? new Date();
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public comparePassword(rawPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, this.password);
  }
}
