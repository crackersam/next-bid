"use server";

import { connect } from "@/helpers/DBConfig";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

connect();

export const RegisterAction = async (formData) => {
  if (!formData.get("email")) {
    return { isError: true, message: "Email is required" };
  }
  if (!formData.get("password")) {
    return {
      isError: true,
      message: "Password is required",
    };
  }
  const user = await User.findOne({
    email: formData.get("email"),
  });
  if (user) {
    return {
      isError: true,
      message: "User already exists",
    };
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(
    formData.get("password"),
    salt
  );
  const newUser = new User({
    email: formData.get("email"),
    password: hashedPassword,
  });
  await newUser.save();
  return { isError: false, message: "User registered" };
};
