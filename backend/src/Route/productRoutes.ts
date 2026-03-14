import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProductBySellerId } from "../Controller/productController.js";
import multer from "multer"



const storage = multer.memoryStorage();

export const upload = multer({ storage });

const productRouter=Router()

productRouter.get("/productId/:productId",getProductById)
productRouter.get("/product-sellerId/:sellerId",getProductBySellerId)
productRouter.post("/create-product",upload.array('images', 4),createProduct)
productRouter.delete("/delete-product/:productId",deleteProduct)

export default productRouter