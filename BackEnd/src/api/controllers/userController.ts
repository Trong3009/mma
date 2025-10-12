import type { Request, Response } from "express";
import { BaseController } from "./base/BaseController.js";
import { UserService } from "../../domain/services/UserService.js";

/**
 * Lấy danh sách người dùng
 */
export class UserController extends BaseController<UserService> {
  protected service : UserService;

  constructor(service: UserService) {
    super();
    this.service = service;
  }

  async findByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params as { username: string };
    const user = await this.service.findByUsername(username);
    res.status(200).json(user);
  }
}
