import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserAuth } from "../../supabase/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = UserAuth();
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const baseLinkClasses =
    "relative text-lg font-medium transition-colors duration-300 pb-1 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full hover:text-red-500";
  const activeLinkClasses =
    "text-red-500 after:w-full after:bg-red-600 font-semibold";

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
        onClick={() => menuOpen && toggleMenu()}
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

  // ✅ Show MagazineNavbar only on /tm or /tm-magazine routes
  const showMagazineNavbar =
    location.pathname.startsWith("/tm") ||
    location.pathname.startsWith("/tm-magazine");

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`top-0 left-0 w-full py-4 ${
          isSticky
            ? "fixed bg-black/60 backdrop-blur-md shadow-md"
            : "absolute bg-black/60"
        } z-50 transition-all duration-300`}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              className="w-44 h-14 object-contain transition-transform duration-300 hover:scale-105"
              src="https://res.cloudinary.com/ddssf6cm6/image/upload/v1755773330/Picsart_25-08-21_10-01-44-550_g5owfe.png"
              alt="Logo"
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex space-x-8 items-center">{navLinks}</ul>

          {/* Dashboard Btn */}
          <div className="hidden lg:block">
            {session && (
              <NavLink
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 shadow-md"
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="lg:hidden mt-3 bg-black/90 backdrop-blur-md rounded-md  p-5 shadow-lg animate-slideDown">
            <ul className="flex flex-col space-y-5 text-center">{navLinks}</ul>
            <div className="mt-5">
              {session && (
                <NavLink
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="block px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300 shadow-md"
                >
                  Dashboard
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>


    </>
  );
};

export default Navbar;
