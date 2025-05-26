import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserAuth } from "../../supabase/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = UserAuth();

  const baseLinkClasses =
    "text-lg hover:text-white transition-colors duration-300 border-b-2 border-transparent hover:border-yellow-300 pb-1";
  const activeLinkClasses = "border-b-2 border-yellow-300 text-yellow-300 pb-1";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          SignUp
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          SignIn
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          Explore
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/features"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          Features
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          Events
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/tmagazine"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          TM-Magazine
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/submitbseen"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          Submit&Bseen
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/library"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          Library
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? `${baseLinkClasses} ${activeLinkClasses}`
              : baseLinkClasses
          }
        >
          About
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="bg-gray-800  mx-auto text-white p-4 shadow-lg">
      <div className="container w-full mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold border-2 rounded text-yellow-300 hover:text-yellow-400 transition-colors duration-300"
        >
          <img
            className="w-40 h-16 duration-300  hover:scale-105"
            src="https://res.cloudinary.com/ddssf6cm6/image/upload/v1748096307/Photoroom-20250518_220125_x58w7v_b_rgb_FFFFFF-removebg-preview_tibain.png"
            alt=""
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">{navLinks}</ul>

        <div className="hidden md:block">
          {session && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? `${baseLinkClasses} ${activeLinkClasses}`
                  : baseLinkClasses
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-gray-700 rounded-md px-4 py-2">
          <ul className="flex flex-col space-y-4">{navLinks}</ul>
          <div className="mt-4">
            {session && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? `${baseLinkClasses} ${activeLinkClasses}`
                    : baseLinkClasses
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
