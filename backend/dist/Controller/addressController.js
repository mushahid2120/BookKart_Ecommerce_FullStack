import response from "../Utility/response.js";
import User from "../Model/User.js";
import Address from "../Model/Address.js";
export async function getAddressByUserId(req, res, next) {
    try {
        const userId = req.id;
        const address = await Address.find({
            user: userId,
        })
            .select("addressLine1 addressLine2 city phoneNumber pin state ")
            .lean();
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
        const { addressId, addressLine1, addressLine2, phoneNumber, city, state, pin, } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return response(res, 404, "user not logedin");
        }
        if (user && !(user?.address?.length <= 2) && !addressId) {
            return response(res, 404, "User Can add only two address");
        }
        if (!addressLine1 || !phoneNumber || !city || !state || !pin) {
            return response(res, 404, "Enter the Required field  user, addressLine1, phoneNumber, city, state, pin");
        }
        if (addressId) {
            const address = await Address.findByIdAndUpdate(addressId, {
                user: userId,
                addressLine1,
                addressLine2: addressLine2 || null,
                phoneNumber,
                city,
                state,
                pin,
            }, {
                upsert: true,
                runValidators: true,
            });
        }
        else {
            const address = new Address({
                user: userId,
                addressLine1,
                addressLine2: addressLine2 || null,
                phoneNumber,
                city,
                state,
                pin,
            });
            if (address._id) {
                user.address.push(address._id);
                await address.save();
            }
            await user.save();
        }
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
