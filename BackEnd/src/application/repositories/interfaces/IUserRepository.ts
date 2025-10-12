import oracledb from "oracledb";
import { IUser, Users } from "../../../domain/models/users/Users.js";
import { BaseCrudRepository, ICrudRepository } from "./base/ICrudRepository.js";

export interface IUserRepository extends ICrudRepository<IUser, string> {
    findByUsername(username: string): Promise<IUser | null>;
}

export class UserRepository extends BaseCrudRepository<Users, string> implements IUserRepository {

  constructor() {
    super("USER", "NQT_USER");
  }
  async findByUsername(username: string): Promise<IUser | null> {
    const conn = await oracledb.getConnection();
    const query = `SELECT * FROM ${this.tableName} WHERE USERNAME = :username`;
    const result = await conn.execute<{ USER_NAME: string }>(
      query,
      { username },
      { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
    );
    await conn.close();

    const row = result.rows?.[0] as IUser | undefined;
    return row || null;
  }

  async setAsync(entity: Users): Promise<Users> {
  const username = entity.username?.trim();
  const validUsername = /^[A-Za-z0-9_]+$/;

  if (!username || !validUsername.test(username)) {
    throw new Error("USER_NAME không được chứa khoảng trắng, dấu hoặc ký tự đặc biệt.");
  }

  const password = String(entity.password || "");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ in hoa, số và ký tự đặc biệt.");
  }

  // 🔹 Kiểm tra email
  const email = entity.email?.trim();
  const validEmail =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email && !validEmail.test(email)) {
    throw new Error("❌ Email không hợp lệ.");
  }

  const conn = await oracledb.getConnection();
  try {
    const checkUserSql = `SELECT COUNT(1) AS CNT FROM ${this.tableName} WHERE USERNAME = :username`;
    const checkUser = await conn.execute<{ CNT: number }>(
      checkUserSql,
      { username },
      { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
    );

    const usernameExists = (checkUser.rows?.[0]?.CNT || 0) > 0;
    if (usernameExists && !(entity as any)[this.idField]) {
      throw new Error(" USERNAME đã tồn tại. Vui lòng chọn tên khác.");
    }
    if (email) {
      const checkEmailSql = `SELECT COUNT(1) AS CNT FROM ${this.tableName} WHERE EMAIL = :email`;
      const checkEmail = await conn.execute<{ CNT: number }>(
        checkEmailSql,
        { email },
        { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
      );

      const emailExists = (checkEmail.rows?.[0]?.CNT || 0) > 0;
      if (emailExists && !(entity as any)[this.idField]) {
        throw new Error("Email đã tồn tại. Vui lòng dùng email khác.");
      }
    }
    if (!entity.role) {
      entity.role = 1;
    }
    await conn.close();
    return await super.setAsync(entity);

  } catch (err) {
    await conn.close();
    throw err;
  }
}

}