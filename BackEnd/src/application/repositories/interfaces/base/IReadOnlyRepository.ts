import { IEntity } from "../../../core/IEntity.js";

export interface IReadOnlyRepository<TEntity extends IEntity<TKey>,TKey> {
    getAllAsync(): Promise<TEntity[]>;
    getAsync(id: TKey): Promise<TEntity>;
    getListAsync(ids: TKey[]): Promise<{entities: [TEntity[], ids: TKey[]]}>;
    findAsync(id: TKey): Promise<TEntity | null>;
}