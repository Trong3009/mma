import { IReadOnlyService } from "../interfaces/base/IReadOnlyService.js";
import { IEntity } from "../../../application/core/IEntity.js";
import { IReadOnlyRepository } from "../../../application/repositories/interfaces/base/IReadOnlyRepository.js";

export abstract class ReadOnlyService<
  TEntity extends IEntity<TKey>,
  TKey,
  TEntityDto
> implements IReadOnlyService<TKey, TEntityDto> {

  // repository làm việc với entity + khóa
  protected abstract repository: IReadOnlyRepository<TEntity, TKey>;

  // map từ entity -> dto (bắt buộc implement ở service con)
  protected abstract mapToDto(entity: TEntity): TEntityDto;

  async getAllAsync(): Promise<TEntityDto[]> {
    const entities = await this.repository.getAllAsync();
    return entities.map(e => this.mapToDto(e));
  }

  async getAsync(id: TKey): Promise<TEntityDto> {
    const entity = await this.repository.getAsync(id);
    return this.mapToDto(entity);
  }

  // Nếu IReadOnlyService khai báo findAsync thì implement luôn
  async findAsync(id: TKey): Promise<TEntityDto | null> {
    const entity = await this.repository.findAsync(id);
    return entity ? this.mapToDto(entity) : null;
  }
}