import oracledb from "oracledb";
import { IEntity } from "../../core/IEntity.js";
import { ICrudRepository } from "../interfaces/base/ICrudRepository.js";
import { BaseReadOnlyRepository } from "./BaseReadOnlyRepository.js";
import { getConnection } from "../../constant/databaseConnection.js";

export abstract class BaseCrudRepository<TEntity extends IEntity<TKey>, TKey>
  extends BaseReadOnlyRepository<TEntity, TKey>
  implements ICrudRepository<TEntity, TKey>{
    async setAsync(entity: TEntity): Promise<TEntity> {
       const conn = await getConnection();
    try {
      const checkSql = `SELECT COUNT(1) AS CNT FROM ${this.tableName} WHERE ${this.idField} = :id`;
      const checkResult = await conn.execute<{ CNT: number }>(
        checkSql,
        { id: (entity as any)[this.idField] },
        { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
      );

      const exists = (checkResult.rows?.[0]?.CNT || 0) > 0;

      if (exists) {
        const fields = Object.keys(entity)
          .filter(k => k.toUpperCase() !== this.idField) // loại bỏ id
          .map(k => `${k.toUpperCase()} = :${k}`)
          .join(", ");

        const updateSql = `UPDATE ${this.tableName} SET ${fields} WHERE ${this.idField} = :${this.idField}`;
        await conn.execute(updateSql, entity as any, { autoCommit: true });
      } else {
        const keys = Object.keys(entity);
        const cols = keys.map(k => k.toUpperCase()).join(", ");
        const vals = keys.map(k => `:${k}`).join(", ");

        const insertSql = `INSERT INTO ${this.tableName} (${cols}) VALUES (${vals})`;
        await conn.execute(insertSql, entity as any, { autoCommit: true });
      }

      return entity;
    } finally {
      await conn.close();
    }
  }
    async deleteAsync(entities: TEntity[]): Promise<void> {
        const conn = getConnection();
        const ids = entities.map(e => (e as any)[this.idField]);
        const query = `DELETE FROM ${this.tableName} WHERE ${this.idField} IN (:ids)`;
        (await conn).execute( query, { ids }, { autoCommit: true });
        return Promise.resolve();
    }
    
  }