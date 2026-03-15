import { Document, model, Schema } from "mongoose";


export interface IWishList extends Document{
    user:Schema.Types.ObjectId;
    product:Schema.Types.ObjectId[];
}

const WishListSchema=new Schema<IWishList>({
    user:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    product:{type:[Schema.Types.ObjectId],required:true,ref:'Product'}
})

const WishList=model('WishList',WishListSchema)

export default WishList