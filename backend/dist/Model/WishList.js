import { model, Schema } from "mongoose";
const WishListSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    product: { type: [Schema.Types.ObjectId], required: true, ref: 'Product' }
});
const WishList = model('WishList', WishListSchema);
export default WishList;
