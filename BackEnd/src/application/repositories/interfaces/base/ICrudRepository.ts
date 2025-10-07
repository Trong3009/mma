import { IEntity } from "../../../core/IEntity.js";
import { IReadOnlyRepository } from "./IReadOnlyRepository.js";

export interface ICrudRepository<TEntity extends IEntity<TKey>, TKey> extends IReadOnlyRepository<TEntity, TKey> {
    setAsync(entity: TEntity): Promise<TEntity>;
    deleteAsync(entities: TEntity[]): Promise<void>;
}