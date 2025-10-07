import * as userService from "../services/userService.js";
/**
 * Lấy danh sách người dùng
 */
export async function getUsers(req, res) {
    try {
        const users = await userService.getUsers();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
/**
 * Tạo hoặc cập nhật người dùng
 */
export async function createUser(req, res) {
    try {
        const result = await userService.createUser(req.body);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
//# sourceMappingURL=userController.js.map