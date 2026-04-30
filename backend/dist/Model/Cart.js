import { model, Schema } from "mongoose";
const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    item: [{
            product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true },
        }],
    orderId: { type: Schema.Types.ObjectId, required: true, ref: 'Order' }
}, { timestamps: true });
const Cart = model("Cart", CartSchema);
export default Cart;
