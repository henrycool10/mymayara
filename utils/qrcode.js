import QRCode from "qrcode";

export default async function generateQRCode(identifier) {
  try {
    // ✅ Absolute URL to profile page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const qrData = `${baseUrl}/staff/${identifier}`;

    return await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
    });
  } catch (err) {
    console.error("QR generation failed:", err);
    return null;
  }
}
