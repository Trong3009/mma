import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export const LogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const cmdId = randomUUID();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const username = (req as any).user?.username || "anonymous";
  const logPath = path.join(process.cwd(), "logs");

  // Tạo thư mục logs nếu chưa có
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }

  // Ghi nội dung log
  const logData = {
    cmdId,
    timestamp: new Date().toISOString(),
    ip,
    method: req.method,
    path: req.originalUrl,
    username,
    data: req.body || null,
  };

  const logLine = JSON.stringify(logData) + "\n";
  fs.appendFileSync(path.join(logPath, `${new Date().toISOString().split("T")[0]}.log`), logLine);

  // Gắn vào request để các controller sau dùng được
  (req as any).cmdId = cmdId;

  next();
};
