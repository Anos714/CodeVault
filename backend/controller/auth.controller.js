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

    const user = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (user) {
      res.status(400);
      throw new Error("User with this email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newlyCreatedUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await generateTokenAndCookie(
      201,
      res,
      "User registered successfully",
      newlyCreatedUser,
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        msg: error.details[0].message,
      });
    }

    const { email, password } = value;

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("User doesn't exits");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    await generateTokenAndCookie(200, res, "User login successfully", user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};
