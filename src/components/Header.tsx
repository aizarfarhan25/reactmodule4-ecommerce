import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CartIcon from "./CartIcon";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  title?: string;
  showCartIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "GegeShop", showCartIcon = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); // buat navigate user ke page login
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-3xl font-extrabold text-black">
          {title}
        </Link>
        <div className="flex gap-6 items-center">
          {/* kalau sudah login, tampilkan tombol logout */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
          )}
          {showCartIcon && <CartIcon />}
        </div>
      </div>
    </header>
  );
};

export default Header;
