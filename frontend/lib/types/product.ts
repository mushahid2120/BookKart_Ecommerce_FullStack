export interface IProduct {
    _id:string;
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
  seller: ISeller;
  createdAt:string;
}


export interface ISeller{
    name:string;
    image:string;
    address: IAddress
}

export interface IAddress {
    user:string;
    addressLine1: string;
    addressLine2:string | null;
    phoneNumber: string;
    city:string;
    state:string;
    pin:string
}


export interface IWishlistItem{
  name: string;
  finalPrice:string;
  images:string;
  _id:string;
}