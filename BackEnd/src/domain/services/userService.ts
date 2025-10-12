
import { IUserRepository } from "../../application/repositories/interfaces/IUserRepository.js";
import type { IUser, Users } from "../models/users/Users.js";
import { CrudService } from "./interfaces/base/ICrudService.js";
import { IUserService } from "./interfaces/IUserService.js";

export class UserService extends CrudService<IUser, string, Users> implements IUserService{

  protected repository: IUserRepository;

  constructor(repository: IUserRepository) {
    super();
    this.repository = repository;
  }

  findByUsername(username: string): Promise<Users | null> {
    const user = this.repository.findByUsername(username);
    if (user == null) {
      return Promise.resolve(this.mapToDto(user));
    } else {
      return Promise.resolve(null);
    } 
  } 
  protected mapToEntity(dto: Partial<Users>): IUser {
    return dto as IUser;
  }

  protected mapToDto(entity: IUser): Users {
    return entity as Users;
  }
}
