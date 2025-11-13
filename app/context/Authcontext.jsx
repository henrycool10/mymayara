"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Check login state when app loads
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get("/api/auth/me");
        setIsAdmin(res.data.loggedIn);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const res = await axios.post("/api/auth/login", { username, password });
    if (res.status === 200) {
      setIsAdmin(true);
    }
    return res;
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
