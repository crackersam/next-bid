"use server";

import { connect } from "@/helpers/DBConfig";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

connect();

export const LoginAction = async (formData) => {
  if (!formData.get("email")) {
    return { isError: true, message: "Email is required" };
  }
  if (!formData.get("password")) {
    return {
      isError: true,
      message: "Password is required",
    };
  }
  try {
    const user = await User.findOne({
      email: formData.get("email"),
    });
    if (!user) {
      return {
        isError: true,
        message: "Invalid credentials",
      };
    }
    const isMatch = await bcryptjs.compare(
      formData.get("password"),
      user.password
    );
    if (!isMatch) {
      return {
        isError: true,
        message: "Invalid credentials",
      };
    }
    // create token
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(
      tokenData,
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    cookies().set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });
  } catch (error) {
    return {
      isError: true,
      message: error.message,
    };
  }
  redirect("/");
};
11;
