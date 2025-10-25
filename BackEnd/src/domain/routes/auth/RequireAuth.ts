import type { Request, Response, NextFunction } from "express";

export const RequireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Chưa đăng nhập" });
    if (!roles.includes(user.role)) return res.status(403).json({ message: "Không có quyền truy cập" });
    next();
  };
};