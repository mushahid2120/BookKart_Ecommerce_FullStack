import { NextFunction, Request, Response } from "express";
import User from "../Model/User.js";
import response from "../Utility/response.js";
import crypto from "crypto";
import {
  sendResetPasswordLinktoEmail,
  sendVerificationEmail,
} from "../Config/emailConfig.js";
import { generateToken } from "../Utility/generateTokens.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    name,
    email,
    password,
    googleId,
    profilePicture,
    phoneNumber,
    agreeTerms,
  } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return response(res, 400, "Email already Exist");
    }
    const verificationToken = crypto.randomBytes(20).toString("hex");
    await User.insertOne({
      name,
      email,
      password,
      googleId,
      profilePicture,
      phoneNumber,
      agreeTerms,
      verificationToken,
    });

    sendVerificationEmail(email, verificationToken);

    return response(res, 200, "User Created");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function verfiyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return response(res, 400, "Invalid token");
    }
    user.isVerified = true;
    user.verificationToken = null;
    user.save();
    const accessToken = generateToken(user._id.toString());
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    response(res, 200, "Your email has been verified");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return response(res, 400, "Invalid Credentials");
    }
    if (!user.isVerified) {
      return response(res, 400, "Verify your email first!! Check your mail");
    }
    const accessToken = generateToken(user._id.toString());
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    response(res, 200, "Login Successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    if (!user) {
      response(res, 400, "User Does not exists");
    }
    if (user) {
      user.resetPasswordToken = resetPasswordToken;
      user.resetPaswordExpires = new Date(Date.now() + 1000 * 60 * 5);
      await user.save();
      const { success } = await sendResetPasswordLinktoEmail(
        user.email as string,
        resetPasswordToken,
      );
    }
    response(res, 200, "Password Resent link has been sent to your email");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPaswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return response(
        res,
        400,
        "Invalid Reset Password token or Reset Password Token has been expired",
      );
    }
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPaswordExpires = null;
    user.save();
    response(res, 200, "Your Password has been updated");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function checkUserAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
      const userId = req.id;
  if (!userId) {
    return response(res, 400, "User not Logged In");
  }
  const user = await User.findById(userId).select("name email profilePicture -_id");
  if(!user){
    return response(res,400,"User Not Found")
  }
  return response(res,200,"Users Data",user)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
