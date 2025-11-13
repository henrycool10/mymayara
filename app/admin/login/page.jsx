"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await login(form.username, form.password);
      if (res.status === 200) router.push("/admin/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="h-screen">
      <form
        onSubmit={submit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto mt-16 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Error Message */}
        {err && <p className="text-red-500 text-sm mb-4">{err}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
