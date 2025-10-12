import { Router } from "express";

const apiRouter = Router();

import userRouter from "./userRouter.js";

apiRouter.use("/user", userRouter);



export default apiRouter;