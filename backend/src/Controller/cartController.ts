import { NextFunction, Request, Response } from "express";
import response from "../Utility/response.js";
import Cart, { ICart, ICartItem } from "../Model/Cart.js";
import { Schema } from "mongoose";
import Product from "../Model/Product.js";

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.id;
    const cart = await Cart.find({
      user: new Schema.Types.ObjectId(userId as string),
    }).lean();
    if (!cart) {
      return response(res, 404, "Your cart is Empty");
    }
    return response(res, 200, "Your Cart Item", cart);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const { productid, quantity } = req.body;
    const product = await Product.findById(productid);

    if (!product) {
      return response(res, 400, "Invalid Product Id");
    }

    if (product.seller.toString() === userId) {
      return response(res, 400, "Seller cannot add to cart thier own product");
    }


    let cart = await Cart.findOne({
      user: new Schema.Types.ObjectId(userId as string),
    });

    if (!cart) {
      cart = new Cart({ user: userId, item: [] });
    }

    const existingItem = cart.item.find(
      (item) => item.product.toString() === productid,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = { product: productid, quantity: quantity };
      cart.item.push(newItem as ICartItem);
    }
    await cart.save();
    return response(res, 200, "Product has been added to Cart");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function removeCart(
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
    const cart = await Cart.findOne({
      user: new Schema.Types.ObjectId(userId as string),
    });
    if (!cart) {
      return response(res, 400, "Cart not Found");
    }
    const ProductInCartIndex = cart.item.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (ProductInCartIndex === -1) {
      return response(res, 404, "Product is not avalable in cart");
    } else if (cart.item[ProductInCartIndex].quantity === 1) {
      cart.item.splice(ProductInCartIndex, 1);
    } else {
      cart.item[ProductInCartIndex].quantity -= 1;
    }
    await cart.save();
    return response(res, 200, "Product has been removed from Cart");
  } catch (error) {
    console.log(error);
    next(error);
  }
}
