import { Users } from "../../models/users/Users.js";
import { ICrudService } from "./base/ICrudService.js";

export interface IUserService extends ICrudService<string, Users> {
    findByUsername(username: string): Promise<Users | null>;
}

