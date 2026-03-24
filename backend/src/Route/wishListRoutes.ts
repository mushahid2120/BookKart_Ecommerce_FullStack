import { Router } from "express";
import { addToWishList, getWishList, removeWishList } from "../Controller/wishListController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const wishListRouter=Router()

wishListRouter.get('/',authenticateUser,getWishList);
wishListRouter.post('/add-to-wishlist/:productId',authenticateUser,addToWishList)
wishListRouter.delete('/remove-wishlist/:productId',authenticateUser,removeWishList)


export default wishListRouter