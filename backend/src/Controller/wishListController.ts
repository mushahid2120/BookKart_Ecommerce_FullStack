import { NextFunction, Request, Response } from "express";
import response from "../Utility/response.js";
import WishList from "../Model/WishList.js";
import { Schema } from "mongoose";
import Product from "../Model/Product.js";

export async function getWishList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const wishlist = await WishList.find({
      user: new Schema.Types.ObjectId(userId as string),
    }).lean();
    if (!wishlist) {
      return response(res, 404, "Your wishlist not found");
    }

    return response(res, 200, "Your wishlist", wishlist);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function addToWishList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return response(res, 400, "Invalid Product Id");
    }

    if (product.seller.toString() === userId) {
      return response(res, 400, "Seller cannot add own product to wishlist");
    }

    let wishlist = await WishList.findOne({
      user: new Schema.Types.ObjectId(userId as string),
    });
    if (!wishlist) {
      wishlist = new WishList({ user: userId, product: [] });
    }
    if (
      !wishlist.product.includes(new Schema.Types.ObjectId(productId as string))
    ) {
      wishlist.product.push(new Schema.Types.ObjectId(productId as string));
    }
    await wishlist.save();
    return response(res, 200, "Product has been added to WishList");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function removeWishList(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return response(res, 400, "Invalid Product Id");
    }

    if (product.seller.toString() === userId) {
      return response(res, 400, "Seller cannot add own product to wishlist");
    }

    let wishlist = await WishList.findOne({
      user: new Schema.Types.ObjectId(userId as string),
    });
    if (wishlist) {
      const productIndex = wishlist.product.findIndex(
        (item) => item.toString() === productId,
      );
      wishlist.product.splice(productIndex, 1);
      await wishlist.save();
    }
    response(res, 200, "product has been deleted from wishlist");
  } catch (error) {
    console.log(error);
    next(error);
  }
}
