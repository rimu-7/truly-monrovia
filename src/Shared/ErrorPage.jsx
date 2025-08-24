// src/pages/ErrorPage.jsx

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // optional icon

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#212121] text-white px-4 text-center">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-black rounded hover:bg-red-600 transition"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
