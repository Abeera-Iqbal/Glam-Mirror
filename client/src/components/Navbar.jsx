import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  // Check karo user login hai ya nahi?
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("guestTryUsed");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-5 bg-black border-b border-gray-900 sticky top-0 z-50">
      {/* --- 💎 NEW AI-FASHION HEAVY LOGO 💎 --- */}
      <Link
        to="/"
        className="group hover:scale-105 transition-transform duration-300"
      >
        <div className="flex items-center gap-3">
          {/* 1. The Custom AI-Fashion Icon (SVG) */}
          <div className="relative drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]">
            <svg
              width="45"
              height="45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white group-hover:text-glam-pink transition-colors duration-300"
            >
              {/* Mirror Frame + Hanger Body Fusion */}
              <path
                d="M12 2C9.5 2 9 4 9 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4H15C15 4 14.5 2 12 2Z"
                stroke="#e0e0e0"
                strokeWidth="2"
                fill="black"
              />

              {/* AI Circuit / Brain Touch inside Mirror */}
              <circle
                cx="12"
                cy="13"
                r="3"
                stroke="#ff007f"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <path d="M12 10V8" stroke="#ff007f" />
              <path d="M12 16V18" stroke="#ff007f" />
              <path d="M15 13H17" stroke="#ff007f" />
              <path d="M9 13H7" stroke="#ff007f" />

              {/* Hanger Hook Top */}
              <path
                d="M12 2C13 2 13.5 1.5 13.5 1"
                stroke="#e0e0e0"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* 2. The Heavy Text */}
          <div className="flex flex-col leading-none select-none">
            <span
              className="text-2xl font-black text-white tracking-wider"
              style={{
                fontFamily: "'Arial Black', sans-serif",
                textShadow: "2px 2px 0px #333",
              }}
            >
              GLAM
            </span>
            <span
              className="text-xl font-black text-glam-pink tracking-[0.2em]"
              style={{
                fontFamily: "'Arial Black', sans-serif",
                textShadow: "0 0 10px #ff007f",
              }}
            >
              MIRROR
            </span>
          </div>
        </div>
      </Link>
      {/* ------------------------------------------- */}
      {/* Links Section */}
      <div className="flex items-center gap-4 md:gap-8">
        <Link
          to="/"
          className="hidden md:block text-gray-300 hover:text-white hover:underline decoration-glam-pink underline-offset-4 transition text-lg font-medium"
        >
          Home
        </Link>
        <Link
          to="/studio"
          className="hidden md:block text-gray-300 hover:text-white hover:underline decoration-glam-pink underline-offset-4 transition text-lg font-medium"
        >
          Studio
        </Link>
        <Link
          to="/wardrobe"
          className="hidden md:block text-gray-300 hover:text-white transition text-lg font-medium"
        >
          Wardrobe
        </Link>
        {/* Auth Buttons */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-white text-sm font-bold bg-gray-900 border border-gray-700 px-4 py-1.5 rounded-full">
              {user.name.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="bg-glam-pink text-white px-6 py-2 rounded-full font-bold hover:bg-pink-600 hover:shadow-[0_0_15px_#ff007f] transition duration-300">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
