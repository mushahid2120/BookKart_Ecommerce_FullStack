import response from "../Utility/response.js";
import WishList from "../Model/WishList.js";
import Product from "../Model/Product.js";
export async function getWishList(req, res, next) {
    try {
        const userId = req.id;
        const wishlist = await WishList.findOne({
            user: userId,
        })
            .populate("product", "title images finalPrice")
            .select("product -_id")
            .lean();
        if (!wishlist) {
            return response(res, 404, "Wish list is Empty");
        }
        return response(res, 200, "Your wishlist", {
            product: wishlist.product.map(({ title, images, finalPrice, _id }) => ({
                title,
                images: images[0],
                finalPrice,
                _id,
            })),
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function addToWishList(req, res, next) {
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
            user: userId,
        });
        if (!wishlist) {
            wishlist = new WishList({ user: userId, product: [] });
        }
        if (!wishlist.product.includes(productId)) {
            wishlist.product.push(productId);
        }
        const afterAdding = await wishlist.save();
        return response(res, 200, "Product has been added to WishList");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function removeWishList(req, res, next) {
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
            user: userId,
        });
        if (wishlist) {
            const productIndex = wishlist.product.findIndex((item) => item.toString() === productId);
            wishlist.product.splice(productIndex, 1);
            await wishlist.save();
        }
        response(res, 200, "product has been deleted from wishlist");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
