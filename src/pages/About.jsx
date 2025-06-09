import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("http://localhost:5022/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus({ success: true, message: data.message });
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      setSubmitStatus({ success: false, message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Floating animation for social media icons
  const iconVariants = (duration) => ({
    initial: { y: 0 },
    animate: {
      y: [10, -10],
      transition: {
        duration: duration,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  });

  return (
    <div className="d max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className=" ">
        <div className=" flex flex-col items-center justify-center  p-8 rounded-lg">
          <div className=" flex flex-col items-center text-center mb-8">
            <h1 className="text-5xl font-bold text-[#FDD700] mb-4">
              Truly Monrovia
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
              labore. Dolorem dolores deserunt eligendi corrupti necessitatibus,
              maxime eius unde. Aliquam fuga nemo nisi dolores cupiditate quo
              nesciunt fugiat rem harum numquam excepturi qui unde delectus
              quaerat eum, quisquam vitae! Sequi? Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Repellat asperiores impedit
              explicabo ab temporibus deserunt nobis dicta vero non aspernatur
              tempore fugit natus nisi porro ut fuga voluptates, id iure.
            </p>
          </div>
          <div className="">
            {/* Phone Numbers */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <FaPhoneAlt className="text-xl sm:text-2xl text-[#FDD700]" />
              <a
                href="tel:+231886120438"
                className="text-lg hover:text-[#FDD700]"
              >
                +1234567890
              </a>
              <a
                href="tel:+231770277646"
                className="text-lg hover:text-[#FDD700]"
              >
                +1234567890
              </a>
              <a
                href="tel:+231555267036"
                className="text-lg hover:text-[#FDD700] sm:text-lg"
              >
                +1234567890
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <MdOutlineEmail className="text-xl sm:text-2xl hover:text-[#FDD700]" />
              <p className="text-lg hover:text-[#FDD700]">abc123@gmail.com</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 xl:gap-8 mt-6">
              {/* <BsMusicNote className="text-4xl sm:text-5xl p-3 rounded-full bg-gray-800 hover:text-orange-600 hover:scale-110 cursor-pointer" /> */}

              <motion.div
                variants={iconVariants(2.6)}
                initial="initial"
                animate="animate"
              >
                <Link to="https://www.facebook.com">
                  <FaFacebook className="text-4xl sm:text-5xl p-3 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-110" />
                </Link>
              </motion.div>

              <motion.div
                variants={iconVariants(2.2)}
                initial="initial"
                animate="animate"
              >
                <Link to="https://www.instagram.com">
                  <FaInstagram className="text-4xl sm:text-5xl p-3 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:scale-110" />
                </Link>
              </motion.div>

              <motion.div
                variants={iconVariants(2.6)}
                initial="initial"
                animate="animate"
              >
                <Link to="https://www.tiktok.com">
                  <FaTiktok className="text-4xl sm:text-5xl p-3 rounded-full bg-black hover:text-gray-400 hover:scale-110" />
                </Link>
              </motion.div>

              <motion.div
                variants={iconVariants(2.9)}
                initial="initial"
                animate="animate"
              >
                <Link to="https://twitter.com">
                  <FaTwitter className="text-4xl sm:text-5xl p-3 rounded-full bg-blue-500 hover:bg-blue-600 hover:scale-110" />
                </Link>
              </motion.div>

              <motion.div
                variants={iconVariants(2)}
                initial="initial"
                animate="animate"
              >
                <Link to="https://www.youtube.com">
                  <FaYoutube className="text-4xl sm:text-5xl p-3 rounded-full bg-red-600 hover:bg-red-700 hover:scale-110" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#FDD700]">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-700   focus:ring-2 focus:ring-[#FDD700] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-700 focus:ring-2 focus:ring-[#FDD700] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-gray-700 focus:ring-2 focus:ring-[#FDD700] focus:outline-none"
              ></textarea>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md font-medium text-black cursor-pointer ${
                isSubmitting
                  ? "bg-[#FDD700] text-gray-400 cursor-not-allowed"
                  : "bg-[#FDD700] hover:bg-yellow-400"
              } transition-colors`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
