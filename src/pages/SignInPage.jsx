// SignInPage.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../supabase/AuthContext";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signInUser } = UserAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const result = await signInUser(email, password);
    if (result.success) {
      navigate("/dashboard"); // or your protected route
    } else {
      setError(result.error || "Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center  text-white px-4">
      <div className="bg-gray-900 border border-red-500 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">Admin Sign In</h2>
        <form className="space-y-5" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="w-full bg-red-500 cursor-pointer text-black font-semibold py-2 px-4 rounded hover:bg-red-600 transition-all duration-300"
          >
            Sign In
          </button>
        </form>
        {/* <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-300 cursor-pointer hover:underline">
            Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default SignInPage;
