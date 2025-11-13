"use client";
import { useEffect, useState } from "react";
import StaffCard from "../../components/StaffCard";

export default function StaffDirectory() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    async function load() {
      try {
        const base =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${base}/api/staff`, { cache: "no-store" });

        if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`);

        const data = await res.json();
        setList(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error loading staff:", err.message);
      } finally {
        setLoading(false); // ✅ finish loading
      }
    }
    load();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    if (!term) {
      setFiltered(list);
    } else {
      setFiltered(
        list.filter(
          (s) =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(term) ||
            (s.position || "").toLowerCase().includes(term) ||
            (s.department || "").toLowerCase().includes(term)
        )
      );
    }
  }, [search, list]);

  // ✅ Universal loading screen (works for all screen sizes)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading staff...
        </p>
      </div>
    );
  }

  // ✅ Show message if no staff found
  if (!filtered || filtered.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No staff records found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Directory</h1>

      {/* 🔍 Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, position, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        />
      </div>

      {/* 🧑‍💼 Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <StaffCard
            key={s._id}
            staff={{
              ...s,
              fullName: s.fullName || `${s.firstName} ${s.lastName}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
