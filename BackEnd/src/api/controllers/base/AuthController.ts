import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { UserService } from "../../../domain/services/UserService.js";

export class AuthController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Thiếu username hoặc password" });
      return;
    }

    try {
      const user = await this.userService.findByUsername(username);
      if (!user) {
        res.status(401).json({ message: "Sai username hoặc password" });
        return;
      }

      // ✅ So sánh password đã hash
      const match = bcrypt.compareSync(password, user.password || "");
      if (!match) {
        res.status(401).json({ message: "Sai username hoặc password" });
        return;
      }

      const SECRET_KEY = process.env.JWT_SECRET ?? "YOUR_SECRET_KEY";
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
}

