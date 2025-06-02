import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserAuth } from "../../supabase/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = UserAuth();

  const baseLinkClasses =
    "text-lg hover:text-white transition-colors duration-300 border-b-2 border-transparent hover:border-yellow-300 pb-1";
  const activeLinkClasses =
    "border-b-2 border-yellow-300 text-yellow-300 pb-1";

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/features", label: "Features" },
    { to: "/events", label: "Events" },
    { to: "/tm-magazine", label: "TM-Magazine" },
    { to: "/submitbseen", label: "Submit & Be Seen" },
    { to: "/library", label: "Library" },
    { to: "/about", label: "About" },
  ];

  const navLinks = links.map((link) => (
    <li key={link.to}>
      <NavLink
        to={link.to}
        onClick={() => {
          if (menuOpen) toggleMenu();
        }}
        className={({ isActive }) =>
          isActive
            ? `${baseLinkClasses} ${activeLinkClasses}`
            : baseLinkClasses
        }
      >
        {link.label}
      </NavLink>
    </li>
  ));

  return (
    <nav className="bg-gray-800 mx-auto text-white p-4 shadow-lg">
      <div className="container w-full mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl mr-2 font-bold border-2 rounded-md text-yellow-300 hover:text-yellow-400 transition-colors duration-300"
        >
          <img
            className="w-40 h-16 duration-300 hover:scale-105"
            src="https://res.cloudinary.com/ddssf6cm6/image/upload/v1748096307/Photoroom-20250518_220125_x58w7v_b_rgb_FFFFFF-removebg-preview_tibain.png"
            alt=""
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 items-center">{navLinks}</ul>

        <div className="hidden lg:block">
          {session && (
            <NavLink
              to="/dashboard"
              className={ ({ isActive }) =>
                isActive
                  ? `${baseLinkClasses} ${activeLinkClasses}`
                  : baseLinkClasses 
              }
            >
              <p className="border-2 ml-2 px-3 rounded-md py-2 font-bold text-center">Dashboard</p>

            </NavLink>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden mt-2 bg-gray-700 rounded-md px-4 py-2">
          <ul className="flex flex-col space-y-4">{navLinks}</ul>
          <div className="mt-4">
            {session && (
              <NavLink
                to="/dashboard"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? `${baseLinkClasses} ${activeLinkClasses}`
                    : baseLinkClasses
                }
              >
                <p className="border-2 bg-red-500  rounded-md py-2 font-bold text-center">Dashboard</p>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
