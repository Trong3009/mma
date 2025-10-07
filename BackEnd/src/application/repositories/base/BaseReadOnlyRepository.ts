import oracledb, { getConnection } from "oracledb";
import { IEntity } from "../../core/IEntity.js";
import { IReadOnlyRepository } from "../interfaces/base/IReadOnlyRepository.js";

export abstract class BaseReadOnlyRepository<TEntity extends IEntity<TKey>, TKey>
  implements IReadOnlyRepository<TEntity, TKey> {
    protected tableName: string;
    protected idField: string;

    constructor(baseName : string) {
        this.tableName = `${baseName.toUpperCase()}S`;
    this.idField = `${baseName.toUpperCase()}_ID`; 
    }

    async getAllAsync(): Promise<TEntity[]> {
        const conn = await getConnection();
        const query = `SELECT * FROM ${this.idField};`;
        const result = await conn.execute<TEntity>(query, [], { outFormat: (oracledb as any).OUT_FORMAT_OBJECT });
        await conn.close();
        return result.rows as TEntity[] || [];

    }
    async getAsync(id: TKey): Promise<TEntity> {
        const entity = await this.findAsync(id);
        if (entity == null) throw new Error(`${this.tableName} with ID ${id} not found.`);
        return entity;
    }
    getListAsync(ids: TKey[]): Promise<{ entities: [TEntity[], ids: TKey[]]; }> {
        const conn = getConnection();
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.idField} IN (:ids)`;
        const result = conn.then(c => c.execute( query, { ids }, { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }));
        return result.then(r => {const rows = r.rows as TEntity[] || [];
            return { entities: [rows, ids] };
        });
    }

    findAsync(id: TKey): Promise<TEntity | null> {
        const conn = getConnection();
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.idField} = :id`;
        const result = conn.then(c => c.execute( query, { id }, { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }));
        return result.then(r => {
            const row = r.rows?.[0] as TEntity | undefined;
            return row || null;
        });
    }
}