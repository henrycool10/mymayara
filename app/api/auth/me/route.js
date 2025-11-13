// app/api/auth/me/route.js
import { requireAdminFromRequest } from "../../../../lib/auth";

export async function GET(req) {
  try {
    const admin = requireAdminFromRequest(req);

    if (!admin) {
      return new Response(
        JSON.stringify({ loggedIn: false }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ loggedIn: true, ...admin }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ loggedIn: false, error: err.message }),
      { status: 500 }
    );
  }
}
