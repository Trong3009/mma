import { IUser } from "../../../domain/models/users/Users.js";
import { ICrudRepository } from "./base/ICrudRepository.js";

export interface IUserRepository extends ICrudRepository<IUser, string> {
    findByUsername(username: string): Promise<IUser | null>;
}