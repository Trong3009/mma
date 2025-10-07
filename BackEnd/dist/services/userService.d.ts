import type { IUser } from "../models/users/Users.js";
/**
 * Lấy danh sách tất cả người dùng
 */
export declare function getUsers(): Promise<Pick<IUser, "username">[]>;
/**
 * Tạo người dùng mới hoặc cập nhật mật khẩu nếu username đã tồn tại
 */
export declare function createUser(data: IUser): Promise<{
    message: string;
}>;
//# sourceMappingURL=userService.d.ts.map