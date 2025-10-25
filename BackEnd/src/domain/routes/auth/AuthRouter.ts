import { Router } from "express";
import { AuthController } from "../../../api/controllers/base/AuthController.js";
import { UserService } from "../../services/UserService.js";
import { UserRepository } from "../../../application/repositories/interfaces/IUserRepository.js";

const AuthRouter = Router();
const controller = new AuthController(new UserService(new UserRepository()));

AuthRouter.post("/login", (req, res) => controller.login(req, res));

export default AuthRouter;