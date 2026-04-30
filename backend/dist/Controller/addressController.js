import response from "../Utility/response.js";
import User from "../Model/User.js";
import Address from "../Model/Address.js";
export async function getAddressByUserId(req, res, next) {
    try {
        const userId = req.id;
        const address = await Address.find({
            user: userId,
        }).lean();
        if (!address) {
            return response(res, 400, "User not added their Address");
        }
        return response(res, 200, "Your Address", address);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function createOrUpdateAddressByUserId(req, res, next) {
    try {
        const userId = req.id;
        const { addressLine1, addressLine2, phoneNumber, city, state, pin } = req.body;
        if (!addressLine1 ||
            !addressLine2 ||
            !phoneNumber ||
            !city ||
            !state ||
            !pin) {
            return response(res, 404, "Enter the Required field  user, addressLine1, addressLine2, phoneNumber, city, state, pin");
        }
        const address = await Address.findOneAndUpdate({ user: userId }, {
            user: userId,
            addressLine1,
            addressLine2: addressLine2 || null,
            phoneNumber,
            city,
            state,
            pin,
        }, {
            new: true,
            upsert: true,
            runValidators: true,
        });
        if (address)
            await User.findByIdAndUpdate(userId, { address: address._id });
        console.log(address);
        return response(res, 200, "User Address Update or Add Successfully");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
export async function deleteAddress(req, res, next) {
    try {
        const userId = req.id;
        await User.findByIdAndUpdate(userId, { address: null });
        await Address.findOneAndDelete({ user: userId });
        return response(res, 200, "Your Address has been deleted");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}
