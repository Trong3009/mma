import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
export class Users {
    id;
    username;
    password;
    name;
    address;
    phone;
    email;
    role;
    status; // 0 = active, 1 = inactive
    created_at;
    updated_at;
    constructor({ id, username, password, name, address, phone, email, role, status, created_at, updated_at, }) {
        this.id = id || randomUUID(); // nếu chưa có id → tự sinh UUID
        this.username = username;
        this.password = this.hashPassword(password); // tự động hash khi tạo
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.role = role ?? 3; // mặc định 3: khách hàng
        this.status = status ?? 0; // mặc định 1: hoạt động
        this.created_at = created_at ?? new Date();
        this.updated_at = updated_at ?? new Date();
    }
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    comparePassword(rawPassword) {
        return bcrypt.compareSync(rawPassword, this.password);
    }
}
//# sourceMappingURL=Users.js.map