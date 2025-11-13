'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import StaffForm from "../../../components/StaffForm";

axios.defaults.withCredentials = true;

export default function AdminDashboard() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // simple toast state
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });

  const showToast = (msg, type = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
  };

  async function load() {
    try {
      const res = await axios.get("/api/staff", { withCredentials: true });
      setList(res.data || []);
    } catch (err) {
      console.error("Error loading staff:", err);
      showToast('Failed to load staff', 'error');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`/api/staff/${deleteId}`, { withCredentials: true });

      // ✅ Only show success toast if delete succeeds
      if (res.status === 200) {
        showToast("Staff deleted", "danger"); // red toast
        await load(); // refresh list
      } else {
        showToast("Failed to delete", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete", "error");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center md:text-left">
        Admin Dashboard
      </h1>

      {/* Staff Form Section */}
      <div className="mb-10 bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4 text-center md:text-left">
          Add / Edit Staff
        </h2>
        <StaffForm
          key={editing?._id || 'new'}
          initial={editing}
          onSaved={async () => { await load(); }}
          onCancel={() => setEditing(null)}
          showToast={showToast}
        />
      </div>

      {/* Staff List Section */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <div
            key={s._id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-transform duration-200 flex flex-col sm:flex-row items-center gap-4"
          >
            <img
              src={s.photo?.url || "/placeholder.png"}
              alt={`${s.firstName} ${s.lastName}`}
              className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-full border border-gray-300"
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="font-semibold text-lg">{s.firstName} {s.lastName}</div>
              <div className="text-sm text-gray-500">{s.position}</div>
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition w-full sm:w-auto"
                onClick={() => setEditing(s)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition w-full sm:w-auto"
                onClick={() => setDeleteId(s._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setDeleteId(null)} />
          <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-11/12 max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm delete</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this staff member? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Toast (top-right) */}
      <div className="fixed top-6 right-6 z-60">
        {toast.show && (
          <div
            className={`px-4 py-2 rounded-md shadow-lg transform transition-all ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'danger'
                ? 'bg-red-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-white'
            }`}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}
