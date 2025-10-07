export interface IReadOnlyService<TKey, TEntityDto> {
    getAllAsync(): Promise<TEntityDto[]>;
    getAsync(id: TKey): Promise<TEntityDto>;
}