import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next();
  }

  try {
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const SECRET_KEY = process.env.JWT_SECRET ?? "YOUR_SECRET_KEY";

      try {
        if (typeof token === "string") {
          const decoded = jwt.verify(token, SECRET_KEY);
          (req as any).user = decoded;
        } else {
          throw new Error("Token is missing or not a string");
        }
      } catch (err) {
        console.warn("⚠️ Bearer token không hợp lệ:", (err as Error).message);
        (req as any).user = null;
      }

      return next();
    }

    if (authHeader.startsWith("Basic ")) {
      const base64Credentials = authHeader.split(" ")[1];
      if (!base64Credentials) {
        console.warn("⚠️ Basic Auth thiếu credentials");
        return next();
      }

      const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
      const [username, password] = credentials.split(":");

      if (!username || !password) {
        console.warn("⚠️ Basic Auth thiếu username hoặc password");
        return next();
      }

      // ... kiểm tra username/password trong DB ...
    }

    return next();
  } catch (err) {
    console.error("AuthMiddleware lỗi ngoài:", err);
    return next();
  }
};
