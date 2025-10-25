import { Router } from "express";

const apiRouter = Router();

import userRouter from "./auth/AuthRouter.js";
import AuthRouter from "./userRouter.js";
apiRouter.use("/auth", AuthRouter);

apiRouter.use("/user", userRouter);



export default apiRouter;