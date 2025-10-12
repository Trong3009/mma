import { IEntity } from "../../../core/IEntity.js";
import { ICrudRepository } from "../../../../application/repositories/interfaces/base/ICrudRepository.js";
import { IReadOnlyService, ReadOnlyService } from "./IReadOnlyService.js";

export interface ICrudService<TKey, TEntityDto> extends IReadOnlyService<TKey, TEntityDto> {
    setAsync(dto: Partial<TEntityDto>): Promise<TEntityDto>;
    deleteAsync(ids: TKey[]): Promise<void>;
}

export abstract class CrudService<TEntity extends IEntity<TKey>,TKey,TEntityDto,>
 extends ReadOnlyService<TEntity, TKey, TEntityDto> 
 implements ICrudService<TKey, TEntityDto> {

    protected abstract repository : ICrudRepository<TEntity, TKey>;

    protected abstract mapToEntity(dto: Partial<TEntityDto>): TEntity;     

    async setAsync(dto: Partial<TEntityDto>): Promise<TEntityDto> {
        const entity = this.mapToEntity(dto);
        const savedEntity = await this.repository.setAsync(entity);
        const result = this.mapToDto(savedEntity);
        return result;
    }
    
    async deleteAsync(ids: TKey[]): Promise<void> {
        const result = await this.repository.deleteAsync(ids);
        return result;
    }
}