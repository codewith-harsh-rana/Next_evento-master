import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function middleware(req) {
  const token = req.cookies.get("token"); // Get token from cookies

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard route
};
