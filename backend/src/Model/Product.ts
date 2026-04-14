import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  category: string;
  condition: string;
  classType: string;
  subject: string;
  images: string[] | null;
  price: number|null;
  author: string | null;
  edition: string | null;
  description: string | null;
  finalPrice: number | null;
  shippingCharge: number | null;
  paymentMode: "UPI"| "Bank Account";
  paymentDetails: {
    upiId: string | null;
    bankDetails: {
      AccountNumber: string |null ;
      IFSC: string | null ;
      BankName: string| null;
    } | null;
  };
  seller: Schema.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  classType: { type: String, required: true },
  subject: { type: String, required: true },
  images: { type: [String], default: null },
  price: { type: Number },
  author: { type: String },
  edition: { type: String },
  description: { type: String },
  finalPrice: { type: Number, required:true},
  shippingCharge: { type: Number, required: true },
  paymentMode: { type: String,enum:['UPI','Bank Account'], required: true },
  paymentDetails: {
    UpiId: { type: String, default: null },
    bankDetails: {
      type: {
        AccountNumber: { type: String, required: true },
        IFSC: { type: String, required: true },
        BankName: { type: String, required: true },
      },
      default: null,
    },
  },
  seller: { type: Schema.Types.ObjectId, required: true ,ref:'User'},
},{
  timestamps:true
});

const Product = model("Product", ProductSchema);

export default Product;
