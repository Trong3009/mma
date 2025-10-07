import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController.js";
const router = Router();
// Lấy danh sách tất cả người dùng
router.get("/", getUsers);
// Tạo mới hoặc cập nhật người dùng
router.post("/", createUser);
export default router;
//# sourceMappingURL=web.js.map