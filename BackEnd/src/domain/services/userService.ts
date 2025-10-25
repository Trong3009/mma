
import bcrypt from "bcryptjs";
import { IUserRepository } from "../../application/repositories/interfaces/IUserRepository.js";
import type { IUser, Users } from "../models/users/Users.js";
import { CrudService } from "./interfaces/base/ICrudService.js";
import { IUserService } from "./interfaces/IUserService.js";

export class UserService extends CrudService<IUser, string, Users> implements IUserService {

  protected repository: IUserRepository;

  constructor(repository: IUserRepository) {
    super();
    this.repository = repository;
  }

  async findByUsername(username: string): Promise<Users | null> {
    const user = await this.repository.findByUsername(username);
    if (!user) return null;
    return this.mapToDto(user);
  }

  // ✅ Override lại setAsync để luôn hash password trước khi lưu
  async setAsync(dto: Partial<Users>): Promise<Users> {
    if (dto.password && !dto.password.startsWith("$2a$")) {
      dto.password = bcrypt.hashSync(dto.password, 10);
    }

    const entity = this.mapToEntity(dto);
    const savedEntity = await this.repository.setAsync(entity);
    const result = this.mapToDto(savedEntity);
    return result;
  }

  // ✅ Vẫn giữ hàm register riêng, nhưng giờ bạn có thể bỏ nếu muốn
  async register(dto: Users): Promise<Users> {
    return this.setAsync(dto);
  }

  protected mapToEntity(dto: Partial<Users>): any {
    return dto as any;
  }

  protected mapToDto(entity: any): Users {
    return entity as Users;
  }
}
