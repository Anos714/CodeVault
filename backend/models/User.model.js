import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
      trim: true,
      minLength: [3, "Username must be atleast 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      required: false,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model("User", UserSchema);
