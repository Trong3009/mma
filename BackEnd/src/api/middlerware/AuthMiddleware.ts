import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();

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

      let conn;
      try {
        conn = await oracledb.getConnection();
        const sql = `SELECT USER_ID, USERNAME, PASSWORD, ROLE FROM NQT_USER.USERS WHERE USERNAME = :username`;
        const result = await conn.execute(sql, { username }, {
          outFormat: (oracledb as any).OUT_FORMAT_OBJECT
        });

        const user = result.rows?.[0];
        if (user && bcrypt.compareSync(password, user.PASSWORD)) {
          (req as any).user = {
            id: user.USER_ID,
            username: user.USERNAME,
            role: user.ROLE
          };
        } else {
          console.warn("Basic Auth: Sai username hoặc password");
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra Basic Auth:", err);
      } finally {
        if (conn) await conn.close();
      }

      return next();
    }
    return next();

  } catch (err) {
    console.error("AuthMiddleware lỗi ngoài:", err);
    return next();
  }
};
