"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const LogoutAction = () => {
  cookies().set("token", "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "strict",
  });
  redirect("/login");
};
