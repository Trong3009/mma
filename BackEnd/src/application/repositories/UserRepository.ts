import oracledb from "oracledb";
import { getConnection } from "../constant/databaseConnection.js";
import { Users,IUser } from "../../domain/models/users/Users.js";
import { IUserRepository } from "./interfaces/IUserRepository.js";
import { BaseCrudRepository } from "./base/BaseCrudRepository.js";

export class UserRepository extends BaseCrudRepository<Users, string> implements IUserRepository {
  async findByUsername(username: string): Promise<IUser | null> {
    const conn = await getConnection();
    const query = `SELECT * FROM ${this.tableName} WHERE USERNAME = :username`;
    const result = await conn.execute<{ USERNAME: string;}>(
      query,
      { username },
      { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
    );
    await conn.close();
    const row = result.rows?.[0] as IUser | undefined;
    return row || null;
  }
}
