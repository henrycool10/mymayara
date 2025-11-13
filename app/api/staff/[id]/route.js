import connectDB from "../../../../lib/mongodb";
import Staff from "../../../../models/Staff";
import generateQRCode from "../../../../utils/qrcode";
import { uploadImage } from "../../../../lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";

function normalizeParams(context) {
  // context.params might be a plain object or an async getter depending on Next version.
  return async () => {
    let params = context.params;
    if (params && typeof params.then === "function") {
      params = await params;
    }
    return params;
  };
}

// GET staff by ID
export async function GET(req, context) {
  try {
    await connectDB();
    const getParams = normalizeParams(context);
    const params = await getParams();
    const id = params?.id;

    if (!id) return new Response("Missing id", { status: 400 });

    let staff = await Staff.findById(id);

    if (!staff) {
      return new Response("Staff not found", { status: 404 });
    }

    // Ensure QR code exists
    if (!staff.qrCodeUrl) {
      const qrCode = await generateQRCode(staff._id);
      staff.qrCodeUrl = qrCode;
      await staff.save();
    }

    return new Response(JSON.stringify(staff), { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/staff/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// UPDATE staff by ID (handles image replacement)
export async function PUT(req, context) {
  try {
    await connectDB();
    const getParams = normalizeParams(context);
    const params = await getParams();
    const id = params?.id;

    if (!id) return new Response("Missing id", { status: 400 });

    const formData = await req.formData();
    const data = Object.fromEntries(
      // formData.entries() can have multiple keys; convert to plain object
      Array.from(formData.entries()).filter(([k]) => k !== "image") // we'll handle image separately
    );

    // Update fullName if first/last changed
    if (data.firstName || data.lastName) {
      const existing = await Staff.findById(id); // to merge with existing if one name missing
      data.fullName = `${data.firstName || existing?.firstName || ""} ${data.lastName || existing?.lastName || ""}`.trim();
    }

    // Look for file under key 'image' (matches your StaffForm)
    const file = formData.get("image");
    if (file && file.size && file.constructor && file.constructor.name === "File") {
      // Read buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Delete old photo if available
      const existing = await Staff.findById(id);
      if (existing?.photo?.public_id) {
        try {
          await cloudinary.uploader.destroy(existing.photo.public_id);
          console.log("🗑️ Old Cloudinary photo removed:", existing.photo.public_id);
        } catch (delErr) {
          console.warn("⚠️ Failed to delete previous Cloudinary image:", delErr.message);
        }
      }

      // Upload new image
      const uploaded = await uploadImage(buffer);
      data.photo = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const updated = await Staff.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return new Response("Staff not found", { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("❌ PUT /api/staff/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE staff by ID (removes cloudinary photo too)
export async function DELETE(req, context) {
  try {
    await connectDB();
    const getParams = normalizeParams(context);
    const params = await getParams();
    const id = params?.id;

    if (!id) return new Response("Missing id", { status: 400 });

    const staff = await Staff.findById(id);
    if (!staff) return new Response("Staff not found", { status: 404 });

    if (staff.photo?.public_id) {
      try {
        await cloudinary.uploader.destroy(staff.photo.public_id);
      } catch (err) {
        console.warn("⚠️ Failed to delete Cloudinary photo on staff delete:", err.message);
      }
    }

    await Staff.findByIdAndDelete(id);
    return new Response("Deleted successfully", { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /api/staff/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
