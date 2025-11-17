import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "./context/Authcontext";

export const metadata = {
  title: "Staff Profile System"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="p-6">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
