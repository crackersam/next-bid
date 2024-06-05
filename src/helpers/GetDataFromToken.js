import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const GetDataFromToken = () => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    return {
      isError: true,
      message: "invalid token" && error.message,
    };
  }
};
