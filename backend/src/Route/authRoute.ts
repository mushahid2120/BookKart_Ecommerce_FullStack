import { Router } from "express";
import { checkUserAuth, forgotPassword, login, register, resetPassword, verfiyEmail } from "../Controller/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const AuthRouter=Router()

AuthRouter.post('/register',register)
AuthRouter.post('/verify-email/:token',verfiyEmail)
AuthRouter.post('/login',login)
AuthRouter.post('/forgot-password',forgotPassword)
AuthRouter.post('/reset-password/:token',resetPassword)
AuthRouter.get('/check-user',authenticateUser,checkUserAuth)


export default AuthRouter