import { model, Schema } from "mongoose";
const AddressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: null },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true }
});
const Address = model("Address", AddressSchema);
export default Address;
