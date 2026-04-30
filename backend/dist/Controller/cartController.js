import response from "../Utility/response.js";
import Cart from "../Model/Cart.js";
import Product from "../Model/Product.js";
export async function getCart(req, res, next) {
    try {
        const userId = req.id;
        const cart = await Cart.findOne({
            user: userId,
        })
            .populate("item.product", "title finalPrice price shippingCharge images")
            .select("item -_id")
            .lean();
        if (!cart) {
            return response(res, 404, "Your cart is Empty");
        }
        return response(res, 200, "Your Cart Item", cart.item.map((cartItem) => ({
            title: cartItem.product.title,
            price: cartItem.product.price,
            finalPrice: cartItem.product.finalPrice,
            shippingCharge: cartItem.product.shippingCharge,
            _id: cartItem.product._id,
            image: cartItem.product.images[0],
            quantity: cartItem.quantity
        })));
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function addToCart(req, res, next) {
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
            user: userId,
        });
        if (!cart) {
            cart = new Cart({ user: userId, item: [] });
        }
        const existingItem = cart.item.find((item) => item.product.toString() === productid);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            const newItem = { product: productid, quantity: quantity };
            cart.item.push(newItem);
        }
        await cart.save();
        return response(res, 200, "Product has been added to Cart");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function removeCart(req, res, next) {
    try {
        const userId = req.id;
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return response(res, 400, "Invalid Product Id");
        }
        const cart = await Cart.findOne({
            user: userId,
        });
        if (!cart) {
            return response(res, 400, "Cart not Found");
        }
        const ProductInCartIndex = cart.item.findIndex((item) => item.product.toString() === productId);
        if (ProductInCartIndex === -1) {
            return response(res, 404, "Product is not avalable in cart");
        }
        else if (cart.item[ProductInCartIndex].quantity === 1) {
            cart.item.splice(ProductInCartIndex, 1);
        }
        else {
            cart.item[ProductInCartIndex].quantity -= 1;
        }
        await cart.save();
        return response(res, 200, "Product has been removed from Cart");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
