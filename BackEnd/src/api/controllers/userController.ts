import type { Request, Response } from "express";
import * as userService from "../../domain/services/userService.js";

/**
 * Lấy danh sách người dùng
 */
export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Tạo hoặc cập nhật người dùng
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const result = await userService.createUser(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

