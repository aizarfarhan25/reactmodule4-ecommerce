import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // validasi email dan pass
    if (!email || !password) {
      setError("Email and password are required.");
      return; // stop proses kalau gagal
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      console.log("Login successful");

      // redirect ke home kalau berhasil login
      navigate("/");
    } catch (error) {
      console.error("Login failed");
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 shadow-lg rounded-md w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h2>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Menampilkan pesan kesalahan jika ada */}
          {error && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {error}
            </div>
          )}

          {/* Tombol login */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="text-center">
                <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
