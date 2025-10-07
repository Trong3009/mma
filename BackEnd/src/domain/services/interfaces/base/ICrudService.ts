import { IReadOnlyService } from "./IReadOnlyService.js";

export interface ICrudService<TKey, TEntityDto> extends IReadOnlyService<TKey, TEntityDto> {
    setAsync(dto: Partial<TEntityDto>): Promise<TEntityDto>;
    deleteAsync(ids: TKey[]): Promise<void>;
}