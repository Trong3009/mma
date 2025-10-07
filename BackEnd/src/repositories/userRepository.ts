import oracledb from "oracledb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getConnection } from "../constant/databaseConnection.js";
import { Users,IUser } from "../models/users/Users.js";

export class UserRepository {
  /**
   * Lấy toàn bộ danh sách user
   */
  async getAllUsers(): Promise<IUser[]> {
    const conn = await getConnection();
    try {
      const result = await conn.execute<IUser>(
        `SELECT ID, USERNAME, NAME, EMAIL, PHONE, ROLE, CREATED_AT, UPDATED_AT
         FROM NQT_USER.USERS`,
        [],
        { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
      );
      return result.rows || [];
    } finally {
      await conn.close();
    }
  }

  /**
   * Tạo user mới hoặc cập nhật nếu username đã tồn tại
   */
  async insertOrUpdateUser(data: IUser): Promise<{ message: string }> {
    const conn = await getConnection();
    try {
      // Kiểm tra username đã tồn tại chưa
      const checkSql = `SELECT ID FROM NQT_USER.USERS WHERE USERNAME = :username`;
      const check = await conn.execute(
        checkSql,
        { username: data.username },
        { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
      );

      const hashedPassword = await bcrypt.hash(data.password, 10);

      if (check.rows && check.rows.length > 0) {
        const updateSql = `
          UPDATE NQT_USER.USERS 
          SET PASSWORD = :password, UPDATED_AT = SYSDATE 
          WHERE USERNAME = :username
        `;
        await conn.execute(
          updateSql,
          { username: data.username, password: hashedPassword },
          { autoCommit: true }
        );
        return { message: "Mật khẩu đã được cập nhật." };
      } else {
        const id = crypto.randomUUID();
        const insertSql = `
          INSERT INTO NQT_USER.USERS 
          (ID, USERNAME, PASSWORD, NAME, ADDRESS, PHONE, EMAIL, ROLE, CREATED_AT, UPDATED_AT)
          VALUES (:id, :username, :password, :name, :address, :phone, :email, :role, SYSDATE, SYSDATE)
        `;
        await conn.execute(
          insertSql,
          {
            id,
            username: data.username,
            password: hashedPassword,
            name: data.name ?? null,
            address: data.address ?? null,
            phone: data.phone ?? null,
            email: data.email ?? null,
            role: data.role ?? 0,
          },
          { autoCommit: true }
        );
        return { message: "Tạo người dùng thành công." };
      }
    } finally {
      await conn.close();
    }
  }
}
