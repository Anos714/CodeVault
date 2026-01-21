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

    const { username, email, password } = value;

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
      role: "user",
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
      res.status(401);
      throw new Error("User doesn't exits");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    await generateTokenAndCookie(200, res, "User logged in successfully", user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { refreshToken: null },
      { new: true },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ success: true, msg: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      res.status(401);
      throw new Error("Unauthorized request, No refresh token");
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_JWT_SECRET,
    );

    const user = await UserModel.findById(decoded._id).select("+refreshToken");
    if (!user) {
      res.status(401);
      throw new Error("Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      res.status(401);
      throw new Error("Refresh token is expired or used");
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    next(error);
  }
};

export const checkUserStatus = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
