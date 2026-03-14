import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  category: string;
  condition: string;
  classType: string;
  subject: string;
  images: string[] | null;
  price: number;
  author: string;
  edition: string | null;
  description: string | null;
  finalPrice: number | null;
  shippingCharge: number | null;
  paymentMode: "UPI"| "Bank Account";
  paymentDetails: {
    upiId: string | null;
    bankDetails: {
      accountNumber: string;
      ifscode: string;
      bankName: string;
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
  price: { type: Number, required: true },
  author: { type: String, required: true },
  edition: { type: String, default: null },
  description: { type: String, default: null },
  finalPrice: { type: Number, required:true},
  shippingCharge: { type: Number, required: true },
  paymentMode: { type: String,enum:['UPI','Bank Account'], required: true },
  paymentDetails: {
    upiId: { type: String, default: null },
    bankDetails: {
      type: {
        accountNumber: { type: String, required: true },
        ifscode: { type: String, required: true },
        bankName: { type: String, required: true },
      },
      default: null,
    },
  },
  seller: { type: Schema.Types.ObjectId, required: true ,ref:'User'},
});

const Product = model("Product", ProductSchema);

export default Product;
