import { model, Schema } from "mongoose";


interface IAddress extends Document {
    user:Schema.Types.ObjectId;
    addressLine1: string;
    addressLine2:string | null;
    phoneNumber: string;
    city:string;
    state:string;
    pin:string
}

const AddressSchema=new Schema<IAddress>({
    user:{type:Schema.Types.ObjectId,required:true},
    addressLine1:{type:String,required:true},
    addressLine2:{type:String,default:null},
    phoneNumber:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    pin:{type:String,required:true}
})

const Address=model<IAddress>("Address",AddressSchema)