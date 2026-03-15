import { Document, model, Schema } from "mongoose";

export interface ICartItem extends Document {
  product: Schema.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  item: ICartItem[];
}

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, required: true ,ref:'User'},
    item: {
      product: { type: Schema.Types.ObjectId, required: true ,ref:'Product'},
      quantity: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

const Cart = model("Cart", CartSchema);
export default Cart;
