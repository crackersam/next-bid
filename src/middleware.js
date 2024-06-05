import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value || "";

  const isPublicPath =
    path === "/login" || path === "/register";

  if (!token && !isPublicPath) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(
      new URL("/profile", request.url)
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile",
    "/",
    "/listitem",
  ],
};
