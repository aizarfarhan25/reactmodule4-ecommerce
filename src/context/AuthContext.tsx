import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axioxInstance";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    console.log("Token di localStorage:", token); // untuk cek token sudah ada atau belum di localStorage

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { access_token, refresh_token } = response.data;

      if (access_token && refresh_token) {
        // simpan token di localStorage jika login berhasil
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        throw new Error("Login failed: Invalid login credentials");
      }
    } catch (error: any) {
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 401:
            throw new Error("Incorrect email or password");
          case 404:
            throw new Error("Account not found");
          case 429:
            throw new Error("Too many login attempts. Please try again later");
          case 500:
            throw new Error("Server error. Please try again in a moment");
          default:
            throw new Error(
              "Login failed: Please check your internet connection and try again"
            );
        }
      }
      throw new Error("Login failed: An error occurred. Please try again");
    }
  };

  const logout = () => {
    // Hapus token dan cart saat logout
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart"); // hapus cart dari localStorage
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};
