import React from "react";
import { NavLink } from "react-router-dom";

const MagazineNavbar = () => {
  const baseLinkClasses =
    "relative text-lg font-medium tracking-wide transition-colors duration-300 pb-2 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full hover:text-red-500";
  const activeLinkClasses =
    "text-red-500 font-semibold after:w-full after:bg-red-600";

  const links = [
    { to: "/tm-magazine", label: "Home" },
    { to: "/tm?category=popular", label: "Popular" },
    { to: "/tm?category=features", label: "Features" },

  ];

  return (
    <nav className="sticky top-22 z-40 bg-black/60 border-t-2 backdrop-blur-md shadow-md border-red-500">
      <div className="container top-26 mx-auto px-6 flex justify-center lg:justify-between items-center py-3">
        {/* Logo or Title (optional) */}
        <h2 className="hidden lg:block text-xl font-bold text-red-600 tracking-wider">
          
        </h2>

        {/* Links */}
        <ul className="flex gap-6 lg:gap-10 items-center">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? `${baseLinkClasses} ${activeLinkClasses}`
                    : baseLinkClasses
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MagazineNavbar;
