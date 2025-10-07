import { IUser } from "../models/users/Users.js";
export declare class UserRepository {
    /**
     * Lấy toàn bộ danh sách user
     */
    getAllUsers(): Promise<IUser[]>;
    /**
     * Tạo user mới hoặc cập nhật nếu username đã tồn tại
     */
    insertOrUpdateUser(data: IUser): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=userRepository.d.ts.map