import { NextFunction, Request, Response } from "express";
import response from "../Utility/response.js";
import Cart, { ICart, ICartItem } from "../Model/Cart.js";
import mongoose, { ObjectId, Schema } from "mongoose";
import Product from "../Model/Product.js";
import Order from "../Model/Order.js";

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({
      user: userId as unknown as ObjectId,
    })
      .populate("item.product", "title finalPrice price shippingCharge images")
      .select("item orderId")
      .lean();
    if (!cart) {
      return response(res, 200, "Your cart is Empty", []);
    }

    return response(res, 200, "Your Cart Item", {
      item: cart.item.map((cartItem: any) => ({
        product: {
          title: cartItem.product.title,
          price: cartItem.product.price,
          finalPrice: cartItem.product.finalPrice,
          shippingCharge: cartItem.product.shippingCharge,
          _id: cartItem.product._id,
          image: cartItem.product.images[0],
        },
        quantity: cartItem.quantity,
      })),
      orderId: cart.orderId,
      cartId: cart._id,
    });
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
      user: userId as unknown as ObjectId,
    });

    if (!cart) {
      const order = new Order({
        user: userId as unknown as ObjectId,
        items: [],
      });
      const result = await order.save();
      cart = new Cart({ user: userId, item: [], orderId: result._id });
    }

    const newItem = { product: productid, quantity: quantity };
    cart.item.push(newItem as ICartItem);
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
      user: userId as unknown as ObjectId,
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
