"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StaffProfilePage() {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Check if current user is admin
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        setIsAdmin(data.loggedIn);
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, []);

  // ✅ Fetch staff details safely
  useEffect(() => {
    let isMounted = true;

    async function fetchStaff() {
      if (!id) return;

      try {
        const res = await fetch(`/api/staff/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load staff");

        const data = await res.json();
        if (isMounted) setStaff(data);
      } catch (err) {
        console.error("Error fetching staff:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStaff();

    // ✅ Auto-refresh every 5s while mounted
    const interval = setInterval(fetchStaff, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  // ✅ Download QR code (admin only)
  const handleDownloadQR = () => {
    if (!staff?.qrCodeUrl) return;
    if (!isAdmin) {
      alert("Only admins can download the QR Code.");
      return;
    }

    const link = document.createElement("a");
    link.href = staff.qrCodeUrl;
    link.download = `${staff.slug || staff._id}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Clean loading UI (centered)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading staff profile...
        </p>
      </div>
    );
  }

  // ✅ Show only after loading finishes
  if (!staff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Staff not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Profile Picture */}
      <div className="flex justify-center">
        <img
          src={staff.photo?.url || "/placeholder.png"}
          alt={staff.fullName || `${staff.firstName} ${staff.lastName}`}
          className="w-40 h-40 object-cover rounded-b-xl border"
        />
      </div>

      {/* Basic Info */}
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold">
          {staff.fullName || `${staff.firstName} ${staff.lastName}`}
        </h1>
        <p className="text-gray-600">{staff.position}</p>
        <p className="text-gray-600">{staff.department}</p>
      </div>

      {/* Contact Info */}
      <div className="mt-4 text-center">
        {staff.email && <p className="text-sm">📧 {staff.email}</p>}
        {staff.phone && <p className="text-sm">📞 {staff.phone}</p>}
      </div>

      {/* Bio */}
      {staff.bio && (
        <div className="mt-6">
          <h2 className="font-semibold">About</h2>
          <p className="text-gray-700">{staff.bio}</p>
        </div>
      )}

      {/* ✅ Always Show QR Code */}
      {staff.qrCodeUrl && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <img
            src={staff.qrCodeUrl}
            alt="Staff QR Code"
            className="w-40 h-40 border rounded"
          />
          {isAdmin && (
            <button
              onClick={handleDownloadQR}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Download QR Code
            </button>
          )}
        </div>
      )}
    </div>
  );
}
