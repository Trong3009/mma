import { Router } from "express";
import { UserController } from "../../api/controllers/userController.js";
import { UserRepository } from "../../application/repositories/interfaces/IUserRepository.js";
import { UserService } from "../services/UserService.js";


const userRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.get("/", userController.getAll.bind(userController));
userRouter.get("/:id", userController.getById.bind(userController));
userRouter.post("/", userController.setAsync.bind(userController));
userRouter.delete("/", userController.deleteAsync.bind(userController));
userRouter.get("/username/:username", userController.findByUsername.bind(userController));

export default userRouter;