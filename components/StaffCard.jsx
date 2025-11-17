import Link from "next/link";

export default function StaffCard({ staff }) {
  return (
    <div className="card hover:shadow-lg block p-4 rounded-lg bg-white">
      {/* Profile Picture */}
      <Link href={`/staff/${staff.slug || staff._id}`}>
        <div className="h-40 overflow-hidden rounded cursor-pointer">
          <img
            src={staff.photo?.url || "/placeholder.png"}
            alt={staff.fullName || `${staff.firstName} ${staff.lastName}`}
            className="w-50 h-50 rounded-lg mx-auto object-cover"
          />
        </div>
      </Link>

      {/* Staff Info */}
      <div className="mt-3 text-center">
        <div className="font-semibold text-lg">
          {staff.fullName || `${staff.firstName} ${staff.lastName}`}
        </div>
        <div className="text-sm text-gray-600">{staff.position}</div>
      </div>

      {/* ✅ QR Code Section */}
      {staff.qrCodeUrl && (
        <div className="mt-3 flex flex-col items-center">
          <img
            src={staff.qrCodeUrl}
            alt="Staff QR Code"
            className="w-24 h-24 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Scan Me</p>
        </div>
      )}
    </div>
  );
}
