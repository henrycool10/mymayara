"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../app/context/Authcontext";

export default function Navbar() {
  const router = useRouter();
  const { isAdmin, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <nav className="bg-gradient-to-r from-[#159DE7] to-[#052F7B] text-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:scale-105">
          <Image
            src="/Mayara2.png"
            alt="Mymayara Logo"
            width={100}
            height={100}
            className="rounded scale-105"
          />
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/staff" className="hover:text-gray-300">
            Staff Directory
          </Link>
          {!loading &&
            (isAdmin ? (
              <>
                <Link href="/admin/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/admin/login" className="hover:text-gray-300">
                Admin Login
              </Link>
            ))}
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden flex flex-col items-start px-4 pb-3 space-y-2 bg-gradient-to-r from-[#159DE7] to-[#052F7B]">
          <Link
            href="/staff"
            className="block hover:text-gray-300"
            onClick={() => setOpen(false)}
          >
            Staff Directory
          </Link>
          {!loading &&
            (isAdmin ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="block hover:text-gray-300"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="block hover:text-gray-300"
                onClick={() => setOpen(false)}
              >
                Admin Login
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}
