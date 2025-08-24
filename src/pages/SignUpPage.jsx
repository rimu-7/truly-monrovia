// pages/SignUpPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../supabase/AuthContext";

// ... imports remain unchanged

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { signUpNewUser } = UserAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("🚫 Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("🔒 Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(name, email, password);

      if (result.success) {
        if (result.data.auth.user?.identities?.length === 0) {
          navigate("/confirm-email", { state: { email } });
        } else {
          navigate("/login");
        }
      } else {
        const supabaseError = result.error?.message || result.error;
        setError(`❗ ${supabaseError || "Sign-up failed. Please try again."}`);
      }
    } catch (err) {
      setError(`⚠️ ${err.message || "An unexpected error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121] text-white px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full border-2 border-red-500 max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
          Create an Account
        </h2>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-700 text-white rounded border border-red-500 animate-pulse text-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 px-4 rounded transition-all duration-300 ${
              loading
                ? "bg-rose-200 text-gray-700 cursor-not-allowed"
                : "bg-red-500 text-black hover:bg-red-600 cursor-pointer"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Sign In
          </Link>
        </p>
        <p className="text-sm text-center mt-2">
          Didn't receive confirmation email?{" "}
          <Link to="/resend-confirmation" className="text-blue-600 hover:underline">
            Resend confirmation
          </Link>
        </p>
      </div>
    </div>
  );
};



export default SignUpPage;
