export default function Footer() {
  return (
    <footer className=" bg-[#052F7B] text-white">
      {/* Bottom Bar */}
      <div className="p-4 text-center text-sm">
        © {new Date().getFullYear()} mymayara. All rights reserved.
      </div>
    </footer>
  );
}
