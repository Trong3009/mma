import oracledb from "oracledb";
import { IEntity } from "../../../../domain/core/IEntity.js";

export interface IReadOnlyRepository<TEntity extends IEntity<TKey>,TKey> {
    getAllAsync(): Promise<TEntity[]>;
    getAsync(id: TKey): Promise<TEntity>;
    getListAsync(ids: TKey[]): Promise<{entities: [TEntity[], ids: TKey[]]}>;
    findAsync(id: TKey): Promise<TEntity | null>;
}

export abstract class BaseReadOnlyRepository<TEntity extends IEntity<TKey>, TKey>
  implements IReadOnlyRepository<TEntity, TKey> {
    protected tableName: string;
    protected idField: string;

    constructor(baseName : string, schema: string = "NQT_USER") {
        this.tableName = `${schema}.${baseName.toUpperCase()}S`;
    this.idField = `${baseName.toUpperCase()}_ID`;
    }

    async getAllAsync(): Promise<TEntity[]> {
        const conn = await oracledb.getConnection();
        const query = `SELECT * FROM ${this.tableName}`;
        const result = await conn.execute<TEntity>(query, [], { outFormat: (oracledb as any).OUT_FORMAT_OBJECT });
        await conn.close();
        return result.rows as TEntity[] || [];

    }
    async getAsync(id: TKey): Promise<TEntity> {
        const entity = await this.findAsync(id);
        if (entity == null) throw new Error(`${this.tableName} with ID ${id} not found.`);
        return entity;
    }
    async getListAsync(ids: TKey[]): Promise<{ entities: [TEntity[], ids: TKey[]]; }> {
        const conn = await oracledb.getConnection();
        try {
        const placeholders = ids.map((_, i) => `:id${i}`).join(", ");
        const binds = Object.fromEntries(ids.map((id, i) => [`id${i}`, id]));
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.idField} IN (${placeholders})`;

        const result = await conn.execute(query, binds, {
            outFormat: (oracledb as any).OUT_FORMAT_OBJECT
        });

        const rows = (result.rows as TEntity[]) || [];
        return { entities: [rows, ids] };
        } finally {
        await conn.close();
        }
    }

    findAsync(id: TKey): Promise<TEntity | null> {
        const conn = oracledb.getConnection();
        const query = `SELECT * FROM ${this.tableName} WHERE ${this.idField} = :id`;
        const result = conn.then(c => c.execute( query, { id }, { outFormat: (oracledb as any).OUT_FORMAT_OBJECT }));
        return result.then(r => {
            const row = r.rows?.[0] as TEntity | undefined;
            return row || null;
        });
    }
}