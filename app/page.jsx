"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image"; // ✅ use Next.js Image for reliability

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-10 md:gap-6 text-gray-800">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900"
          >
            Welcome to
            <br /> MayAra Staff <br /> Website
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-gray-600"
          >
            MayAra Staff — the heart of excellence, the spark of purpose,{" "}
            <br className="hidden md:block" />
            and the guardians of a greener future.
          </motion.p>

          <Link href="/staff">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 rounded-full bg-gradient-to-r from-[#159DE7] to-[#052F7B] text-white py-3 px-8 text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all"
            >
              Staff Directory
            </motion.button>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="w-60 sm:w-72 md:w-80 bg-gradient-to-r from-[#159DE7] to-[#052F7B] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center"
        >
          {/* ✅ Next.js Image component for proper loading */}
          <Image
            src="/bg33.png" // ✅ must be in /public folder
            alt="MayAra Logo"
            width={400}
            height={400}
            priority
            className="object-contain w-full h-auto"
          />
        </motion.div>
      </div>
    </div>
  );
}
