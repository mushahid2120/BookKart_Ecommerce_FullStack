import { NextFunction, Request, Response } from "express";
import response from "../Utility/response.js";
import User from "../Model/User.js";
import Address from "../Model/Address.js";
import { ObjectId } from "mongoose";

export async function getAddressByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const address = await Address.find({
      user: userId as unknown as ObjectId,
    }).lean();
    if (!address) {
      return response(res, 400, "User not added their Address");
    }
    return response(res, 200, "Your Address", address);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createOrUpdateAddressByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    const { addressLine1, addressLine2, phoneNumber, city, state, pin } =
      req.body;
    if (
      !addressLine1 ||
      !addressLine2 ||
      !phoneNumber ||
      !city ||
      !state ||
      !pin
    ) {
      return response(
        res,
        404,
        "Enter the Required field  user, addressLine1, addressLine2, phoneNumber, city, state, pin",
      );
    }

    const address = await Address.findOneAndUpdate(
      { user: userId as unknown as ObjectId },
      {
        user:userId,
        addressLine1,
        addressLine2: addressLine2 || null,
        phoneNumber,
        city,
        state,
        pin,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    if (address) await User.findByIdAndUpdate(userId, { address: address._id });
    console.log(address);

    return response(res, 200, "User Address Update or Add Successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function deleteAddress(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.id;
    await User.findByIdAndUpdate(userId as string,{address:null})
    await Address.findOneAndDelete({user:(userId as unknown) as ObjectId})
    return response(res,200,"Your Address has been deleted")
  } catch (error) {
    console.log(error);
    next(error);
  }
}
