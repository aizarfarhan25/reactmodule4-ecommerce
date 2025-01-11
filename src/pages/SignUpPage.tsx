import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "../utils/axioxInstance";

// Define types for signup data
interface SignUpData {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

// Create signup service
const signUpService = {
  async registerUser(userData: SignUpData) {
    try {
      const response = await axios.post("/users/", userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(
              "Invalid data provided. Please check your information"
            );
          case 409:
            throw new Error("Email is already registered");
          case 422:
            throw new Error("Please provide valid email and password");
          case 500:
            throw new Error("Server error. Please try again in a moment");
          default:
            throw new Error(
              "Registration failed. Please check your connection and try again"
            );
        }
      }
      throw new Error("Unable to complete registration. Please try again");
    }
  },

  // bagian validasi password
  validatePassword(password: string): string | null {
    // untuk cek minimal 9 karakter
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // untuk cek minimal ada 1 huruf besar / capital
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    // untuk cek minimal ada 1 angka
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    return null;
  },

  // bagian validasi semua field harus diisi
  validateInputs(name: string, email: string, password: string): string | null {
    if (!name || !email || !password) {
      return "All fields are required";
    }

    // untuk validasi email sudah sesuai format atau tidak
    if (!email.includes("@")) {
      return "Please enter a valid email address";
    }

    // untuk validasi password
    const passwordError = this.validatePassword(password);
    if (passwordError) {
      return passwordError;
    }

    return null;
  },
};

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = signUpService.validateInputs(name, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userData: SignUpData = {
        name,
        email,
        password,
        avatar: "https://picsum.photos/800",
      };
      await signUpService.registerUser(userData);

      // menampilkan success message and redirect ke halaman login jika berhasil signup
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-1 items-center justify-center mt-10">
        <form
          onSubmit={handleSignUp}
          className="bg-white p-8 shadow-lg rounded-md w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Create Account
          </h2>

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          {error && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-500 text-center font-semibold">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gray-950 text-white rounded-lg hover:bg-gray-900 transition font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="text-center">
                <div className="w-6 h-6 border-4 border-t-4 border-white rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
