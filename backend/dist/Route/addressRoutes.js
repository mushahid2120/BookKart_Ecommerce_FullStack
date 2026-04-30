import { Router } from "express";
import { createOrUpdateAddressByUserId, deleteAddress, getAddressByUserId } from "../Controller/addressController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const addressRouter = Router();
addressRouter.get('/', authenticateUser, getAddressByUserId);
addressRouter.post('/create-update-address', authenticateUser, createOrUpdateAddressByUserId);
addressRouter.delete('/delete-address', authenticateUser, deleteAddress);
export default addressRouter;
