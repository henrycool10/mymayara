import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      loggedIn: true,
      user: { id: decoded.id, username: decoded.username },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}
