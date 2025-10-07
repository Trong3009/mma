import { UserRepository } from "../repositories/userRepository.js";
const userRepo = new UserRepository();
/**
 * Lấy danh sách tất cả người dùng
 */
export async function getUsers() {
    const users = await userRepo.getAllUsers();
    return users.map(u => ({
        username: u.username,
    }));
}
/**
 * Tạo người dùng mới hoặc cập nhật mật khẩu nếu username đã tồn tại
 */
export async function createUser(data) {
    if (!data.username || !data.password) {
        throw new Error("Thiếu thông tin username hoặc password!");
    }
    // Gọi repo để insert hoặc update
    const result = await userRepo.insertOrUpdateUser(data);
    return result;
}
//# sourceMappingURL=userService.js.map