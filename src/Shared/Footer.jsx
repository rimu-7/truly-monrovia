import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setYear(new Date().getFullYear()), []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setShowToast(true);
    setEmail("");
    setIsSubmitting(false);

    setTimeout(() => setShowToast(false), 3000);
  };

  // Floating animation for social icons
  const iconVariants = (duration) => ({
    initial: { y: 0 },
    animate: {
      y: [5, -5],
      transition: {
        duration: duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  });

  // Toast animation variants
  const toastVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.3 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  return (
    <footer className="relative bg-gray-900 text-gray-100 mt-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 relative z-10">
        {/* Logo & About */}
        <div className="space-y-4">
          <Link to="/" className="flex flex-col items-start">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/ddssf6cm6/image/upload/v1755773330/Picsart_25-08-21_10-01-44-550_g5owfe.png"
                alt="Truly Monrovia Logo"
                className="h-36 w-48 object-contain filter drop-shadow-lg"
              />
            </div>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Empowering innovation with technology. Your trusted partner in
            digital transformation and community development.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold  mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500">
            Quick Links
          </h3>
          <ul className="flex md:flex-col space-y-3 gap-3 text-sm sm:flex-row sm:space-x-6">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About Us" },
              { path: "/submitbseen", label: "Services" },
              { path: "/contact", label: "Contact" },
            ].map((link, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex items-center"
              >
                <Link
                  to={link.path}
                  className="flex  items-center group text-gray-400 hover:text-gray-100 transition-colors"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full mx-2  opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-5 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500">
            Stay Connected
          </h3>

          <form className="relative group" onSubmit={handleSubscribe}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-600 rounded opacity-50 group-hover:opacity-100 transition duration-300 blur-sm group-hover:blur-md"></div>
            <div className="relative flex bg-gray-800 rounded-lg">
              <input
                type="email"
                placeholder="Signup for Newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 w-full bg-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 border-none"
                required
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-500 px-16 py-3 rounded-r-lg  font-medium relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 rounded-full border-2 border-gray-100 border-t-transparent mx-auto"
                  />
                ) : (
                  "Subscribe"
                )}
              </motion.button>
            </div>
          </form>

          <div>
            <h4 className="text-sm font-medium  mb-4">Follow Us</h4>
            <div className="flex justify-start gap-4">
              {[
                {
                  icon: FaFacebook,
                  color: "bg-blue-600",
                  link: "https://www.facebook.com/profile.php?id=100051511567413&mibextid=rS40aB7S9Ucbxw6v",
                },
                {
                  icon: FaInstagram,
                  color:
                    "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500",
                  link: "https://www.instagram.com/truly_monrovia?igsh=MXdqM3Jpdng3NDZueA==",
                },
                {
                  icon: FaTiktok,
                  color: "bg-black",
                  link: "https://www.tiktok.com",
                },
                {
                  icon: FaTwitter,
                  color: "bg-blue-500",
                  link: "https://twitter.com",
                },
                {
                  icon: FaYoutube,
                  color: "bg-red-600",
                  link: "https://www.youtube.com",
                },
              ].map((social, index) => (
                <motion.div
                  key={index}
                  variants={iconVariants(2 + index * 0.5)}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    to={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white p-3 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <social.icon className="text-xl" />
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Contact Info */}
            <div className="pt-4 flex  justify-between space-y-2">
              <div className="flex items-center flex-col space-x-3 text-gray-400  transition-colors">
                <div className="flex gap-2 items-center hover:text-red-400">
                  <FaPhoneAlt className="text-sm" />
                  <span className="text-sm">+231887289983</span>
                </div>
                <div className="flex gap-2 items-center hover:text-red-400">
                  <FaPhoneAlt className="text-sm" />
                  <span className="text-sm">+23177 8489935</span>
                </div>
              </div>
              <div className="flex items-center justify-center  space-x-3 text-gray-400 hover:text-red-400 transition-colors">
                <MdOutlineEmail className="text-lg" />
                <span className="text-sm">trulymonrovia@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700/50 text-center py-6 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <small className="text-gray-500 text-sm">
            © {year} <Link to={"/login"}>Truly Monrovia</Link>. All Rights
            Reserved.
          </small>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-xl z-50 border-l-4 border-green-500 max-w-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  Successfully Signup for Newsletter!
                </p>
                <p className="mt-1 text-sm text-red-400">
                  Thank you for joining our newsletter.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

export default Footer;
