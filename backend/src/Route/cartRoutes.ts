import { Router } from "express";
import { addToCart, getCart, removeCart } from "../Controller/cartController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const cartRouter=Router()


cartRouter.get('/',authenticateUser,getCart);
cartRouter.post('/add-to-cart',authenticateUser,addToCart)
cartRouter.delete('/remove-cart/:productId',authenticateUser,removeCart)

export default cartRouter

