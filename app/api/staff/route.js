import connectDB from "../../../lib/mongodb";
import Staff from "../../../models/Staff";
import { requireAdminFromRequest } from "../../../lib/auth";
import { uploadImage } from "../../../lib/cloudinary";
import generateQRCode from "../../../utils/qrcode";

// GET all staff
export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find();
    return new Response(JSON.stringify(staff), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// CREATE staff
export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    let imageUrl = "";
    if (formData.get("image")) {
      const file = formData.get("image");
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploaded = await uploadImage(buffer);
      imageUrl = uploaded.secure_url;
    }

    const staff = new Staff({
      ...data,
      photo: imageUrl ? { url: imageUrl } : undefined,
    });
    await staff.save();

    // ✅ Generate QR code with staff._id
    const qrCode = await generateQRCode(staff._id);
    staff.qrCodeUrl = qrCode;
    await staff.save();

    return new Response(JSON.stringify(staff), { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/staff error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
