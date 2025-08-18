import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserAuth } from "../../../supabase/AuthContext";

const MagazineNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = UserAuth();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);



  const baseLinkClasses =
    "text-lg hover:text-white transition-colors duration-300 border-b-2 border-transparent hover:border-yellow-300 pb-1";
  const activeLinkClasses = "border-b-2 border-yellow-300 text-yellow-300 pb-1";

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const links = [
    { to: "/tm-magazine", label: "Home" },
    { to: "/tm", label: "TM-Magazine" },
    { to: "/tm?category=popular", label: "Popular" },
    { to: "/tm-magazine/archive", label: "Archive" },
  ];

  const navLinks = links.map((link) => (
    <li key={link.to}>
      <NavLink
        to={link.to}
        onClick={() => {
          if (menuOpen) toggleMenu();
        }}
        className={({ isActive }) =>
          isActive ? `${baseLinkClasses} ${activeLinkClasses}` : baseLinkClasses
        }
      >
        {link.label}
      </NavLink>
    </li>
  ));

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`absolute top-27 left-0 w-full  py-5 ${
        isSticky
          ? "fixed bg-black/30 backdrop-blur-sm border-t-2 "
          : "bg-transparent"
      } z-50 transition-all duration-300`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Logo/Brand */}
        <Link
          to="/tm-magazine"
          className="text-2xl font-bold text-yellow-300 hover:text-yellow-400 transition-colors duration-300"
        >
          
        </Link>

        {/* Right side: Nav Links */}
        <ul className="hidden lg:flex space-x-6 items-center">{navLinks}</ul>
        {/* Mobile Menu Button */}
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
                <p className="border-2 bg-red-500 rounded-md py-2 font-bold text-center">
                  Dashboard
                </p>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MagazineNavbar;
