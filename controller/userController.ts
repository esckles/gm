import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../model/userModel";
import jwt from "jsonwebtoken";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(4).toString("hex");
    const user = await userModel.create({
      userName,
      email,
      password: hashed,
      isVerifiedToken: token,
    });
    return res.status(201).json({
      message: "Account created successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error creating account", status: 404 });
  }
};

export const VerifyAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isVerified: true,
        isVerifiedToken: "",
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Account verified successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Error verifying account", status: 404 });
  }
};

export const LoginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const decryptedPassword = await bcrypt.compare(password, user.password);
      if (decryptedPassword) {
        if (user?.isVerified && user?.isVerifiedToken === "") {
          const token = jwt.sign(
            { id: user?._id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES }
          );
          return res
            .status(201)
            .json({ message: "Login successfully", data: token, status: 201 });
        } else {
          return res
            .status(404)
            .json({ message: "please verify your account", status: 404 });
        }
      } else {
        return res
          .status(404)
          .json({ message: "incorrect password", status: 404 });
      }
    } else {
      return res.status(404).json({ message: "email not found", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "error with login", status: 404 });
  }
};

export const readOneuser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID);
    return res
      .status(200)
      .json({ message: "One UserRead", data: user, status: 200 });
  } catch (error) {
    return res.status(404).json({ message: "error readOne user", status: 404 });
  }
};
export const readAlluser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();
    return res
      .status(200)
      .json({ message: "One UserRead", data: user, status: 200 });
  } catch (error) {
    return res.status(404).json({ message: "error readOne user", status: 404 });
  }
};

export const forgetPasssword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const token = crypto.randomBytes(6).toString("hex");
    const user = await userModel.findOne(email);
    if (user) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          isVerifiedToken: token,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "email has been sent to you", status: 200 });
    } else {
      return res.status(404).json({ message: "something wrong", status: 404 });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ message: "error password change", status: 404 });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    if (userID) {
      await userModel.findByIdAndUpdate(
        userID,
        {
          isVerifiedToken: "",
          password: hashed,
        },
        { new: true }
      );
      return res.status(200).json({ message: "password changed", status: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "something wrong with password change", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ message: "error", status: 404 });
  }
};
