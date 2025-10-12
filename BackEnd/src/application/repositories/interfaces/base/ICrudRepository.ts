import oracledb from "oracledb";
import { IEntity } from "../../../../domain/core/IEntity.js";
import { BaseReadOnlyRepository, IReadOnlyRepository } from "./IReadOnlyRepository.js";

export interface ICrudRepository<TEntity extends IEntity<TKey>, TKey> extends IReadOnlyRepository<TEntity, TKey> {
    setAsync(entity: TEntity): Promise<TEntity>;
    deleteAsync(entities: TKey[]): Promise<void>;
}

export abstract class BaseCrudRepository<TEntity extends IEntity<TKey>, TKey>
    extends BaseReadOnlyRepository<TEntity, TKey>
    implements ICrudRepository<TEntity, TKey> {

    constructor(baseName: string, schema: string = "NQT_USER") {
        super(baseName, schema);
    }

    async setAsync(entity: TEntity): Promise<TEntity> {
        const conn = await oracledb.getConnection();
        try {
            const dbEntity = this.toDbEntity(entity);
            const checkSql = `SELECT COUNT(1) AS CNT FROM ${this.tableName} WHERE ${this.idField} = :id`;
            const checkResult = await conn.execute<{ CNT: number }>(
                checkSql,
                { id: (entity as any)["id"] },
                { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }
            );

            const exists = (checkResult.rows?.[0]?.CNT || 0) > 0;

            if (exists) {
                const fields = Object.keys(dbEntity)
                    .filter(k => k !== this.idField)
                    .map(k => `${k} = :${k}`)
                    .join(", ");

                const updateSql = `UPDATE ${this.tableName} SET ${fields} WHERE ${this.idField} = :${this.idField}`;
                await conn.execute(updateSql, dbEntity, { autoCommit: true });
            } else {
                const cols = Object.keys(dbEntity).join(", ");
                const vals = Object.keys(dbEntity).map(k => `:${k}`).join(", ");
                const insertSql = `INSERT INTO ${this.tableName} (${cols}) VALUES (${vals})`;
                await conn.execute(insertSql, dbEntity, { autoCommit: true });
            }

            return entity;
        } finally {
            await conn.close();
        }
    }
    async deleteAsync(entities: any): Promise<void> {
        const conn = await oracledb.getConnection();
        try {
            let ids: string[] = [];

            if (Array.isArray(entities))  ids = entities.map(e => typeof e === "object" ? (e.id || e.userId || e.USER_ID) : e);
            else if (typeof entities === "object") ids = [entities.id || entities.userId || entities.USER_ID];
            else ids = [entities]

            ids = ids.filter(id => !!id);
            if (ids.length === 0) throw new Error("Không tìm thấy ID hợp lệ để xóa.");

            const idList = ids.map(id => `'${id}'`).join(", ");
            const query = `DELETE FROM ${this.tableName} WHERE ${this.idField} IN (${idList})`;

            console.log("Executing:", query);
            await conn.execute(query, [], { autoCommit: true });
        } finally {
            await conn.close();
        }
    }

    protected toDbEntity(entity: any): any {
        const dbEntity: any = {};
        for (const key of Object.keys(entity)) {
            dbEntity[key.toUpperCase()] = entity[key];
        }
        return dbEntity;
    }
    protected fromDbRow(row: any): any {
        const jsEntity: any = {};
        for (const key of Object.keys(row)) {
            const lower = key.toLowerCase();
            const camel = lower.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
            jsEntity[camel] = row[key];
        }
        return jsEntity;
    }
}