// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (username === "admin" && password === "mymayara") {
      // Generate token
      const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Create response
      const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );

      // ✅ Attach cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax", // use lax for local dev
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });

      return response;
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
