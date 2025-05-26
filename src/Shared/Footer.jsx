import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="fixed-bottom border-t-2 bg-gray-900 flex justify-center p-2  text-center">
      <small className="w-full text-yellow-300">
        All Rights Reserved &copy; {year} Copyrights{" "}
        <span style={{ fontFamily: "Abril Fatface, serif" }}><Link to="/login" className="underline">CreaqTech</Link></span> .
        
      </small>
    </div>
  );
}

export default Footer;