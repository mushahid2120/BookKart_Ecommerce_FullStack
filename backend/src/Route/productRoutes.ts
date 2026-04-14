import { Router } from "express";
import { createProduct, deleteProduct, getAllProduct, getProductById, getProductBySellerId } from "../Controller/productController.js";
import multer from "multer"
import { authenticateUser } from "../middleware/authMiddleware.js";



const storage = multer.memoryStorage();

export const upload = multer({ storage });

const productRouter=Router()

productRouter.get("/",getAllProduct)
productRouter.get("/productId/:productId",getProductById)
productRouter.get("/product-seller-id",authenticateUser,getProductBySellerId)
productRouter.post("/create-product",authenticateUser,upload.array('images', 4),createProduct)
productRouter.delete("/delete-product/:productId",authenticateUser,deleteProduct)

export default productRouter