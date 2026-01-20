import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model.js";
import { registerSchema, loginSchema } from "../validations/user.validation.js";
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js";

export const registerUser = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message,
      });
    }

    const { username, email, password, role } = value;
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newlyCreatedUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    generateTokenAndCookie(
      201,
      res,
      "User registered successfully",
      newlyCreatedUser,
    );
  } catch (error) {
    next(error);
  }
};
