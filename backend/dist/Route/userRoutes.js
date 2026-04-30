import { Router } from "express";
import { updateUserProfile } from "../Controller/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const userRouter = Router();
userRouter.put("/update-user", authenticateUser, updateUserProfile);
export default userRouter;
