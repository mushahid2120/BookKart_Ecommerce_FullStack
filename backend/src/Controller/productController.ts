import { NextFunction, Response, Request } from "express";
import { uploadToCloudinary, deleteImage } from "../Config/cloudinaryConfig.js";
import Product, { IProduct } from "../Model/Product.js";
import response from "../Utility/response.js";
import mongoose, { Schema, Types } from "mongoose";


export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {

  const userId=req.id;
  console.log(req.body)
  try {
    const {
      title,
      category,
      condition,
      classType,
      subject,
      price,
      author,
      edition,
      description,
      finalPrice,
      shippingCharge,
      paymentMode,
      paymentDetails,
    } = req.body as unknown as IProduct;

    const paymentDetailsParse =
      typeof paymentDetails === "string"
        ? JSON.parse(paymentDetails)
        : paymentDetails;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images received" });
    }
    if (
      paymentMode === "UPI" &&
      (!paymentDetailsParse || !paymentDetailsParse?.UpiId)
    ) {
      return response(res, 404, "UPI is Required for paymentMode UPI");
    }

    
    console.log({paymentDetails})
    console.log({paymentDetailsParse})
    
    if (
      paymentMode === "Bank Account" &&
      (!paymentDetailsParse ||
        !paymentDetailsParse?.bankDetails ||
        !paymentDetailsParse?.bankDetails.AccountNumber ||
        !paymentDetailsParse?.bankDetails.IFSC ||
        !paymentDetailsParse?.bankDetails.BankName)
    ) {
      return response(
        res,
        404,
        "Required Field all the AccountNumber,ifscode,bankName for paymentMode Bank Account",
      );
    }


    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((item: any) => item.secure_url);

    await Product.insertOne({
      title,
      category,
      condition,
      classType,
      subject,
      images: imageUrls,
      price: Number(price),
      author,
      edition,
      description,
      finalPrice: Number(finalPrice),
      shippingCharge: Number(shippingCharge),
      paymentMode,
      paymentDetails:paymentDetailsParse,
      seller: (userId as unknown )as Schema.Types.ObjectId
    });

    return response(res, 200, "Product created Successfully");
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error });
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return response(res, 404, "Product Not Found");
    }
    if (product.images) {
      const productPublicIds = product.images.map((image) => {
        const imageUrlSplitted = image.split("/");
        const publicId =
          "bookkart/" +
          imageUrlSplitted[imageUrlSplitted.length - 1].split(".")[0];
        return deleteImage(publicId);
      });
      const productDeletePromises = await Promise.all(productPublicIds);
    }
    const ddbRes = await product.deleteOne();
    return response(res, 200, "Product has been delete");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    if(!productId){
      response(res,404,"Invalid Product Id ")
    }
    const product=await Product.findById(productId).populate("seller","name").lean()
    if(!product){
      return response(res,404,"product not found!!")
    }
    response(res,200,"Product Details",product)

  } catch (error) {
    console.log(error)
    next(error)
  }
}

export async function getProductBySellerId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
   const { sellerId } = req.params;
   if(!sellerId){
    response(res,404,"Invalid Seller Id")
   }
    const product=await Product.find({seller:sellerId as any}).populate("seller","name").lean()
 
    if(!product){
      return response(res,404,"product not found!!")
    }
    response(res,200,"Product Details",product)

  } catch (error) {
    console.log(error)
    next(error)
  }
}
