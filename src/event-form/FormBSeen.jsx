import React, { useState } from "react";
import { supabase } from "../../supabase/supabase_client";
import { toast } from "react-toastify";

const EventForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "",
    address: "",
    creative_name: "",
    social_media: "",
    link_to_project: "",
    link_to_profile: "",
  });



  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit the form data

      const { error: submissionError } = await supabase
        .from("submitbseen")
        .insert([
          {
            name: formData.name,
            contact: formData.contact,
            category: formData.category,
            address: formData.address,
            creative_name: formData.creative_name,
            social_media: formData.social_media,
            link_to_project: formData.link_to_project,
            link_to_profile: formData.link_to_profile,
          },
        ]);

      if (submissionError) {
        console.error("Submission details:", {
          error: submissionError,
          formData: formData,
        });
        throw submissionError;
      }

      toast.success("successful!");
      // Reset form
      setFormData({
        name: "",
        contact: "",
        category: "",
        address: "",
        creative_name: "",
        social_media: "",
        link_to_project: "",
        link_to_profile: "",
      });
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center mx-auto items-center py-20">
      <div className="">{/* <Events /> */}</div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-gray-800 text-gray-300 rounded-lg shadow-2xl  p-8 md:p-12 flex flex-col gap-6"
      >
        <h1 className="text-3xl sm:text-4xl text-center text-yellow-300 font-bold mb-4">
          Sign Up for Event
        </h1>

        {/* Input fields */}
        <div className="w-full flex flex-col">
          <label htmlFor="name" className="mb-2 text-lg">
            Name
          </label>
          <input
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="w-full flex flex-col">
          <label htmlFor="contact" className="mb-2 text-lg">
            Contact
          </label>
          <input
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            type="text"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Phone or Email"
            required
          />
        </div>

        <div className="w-full flex flex-col">
          <label htmlFor="category" className="mb-2 text-lg">
            Category
          </label>
          <select
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select your category
            </option>
            <option value="music">Music</option>
            <option value="fashion">Fashion</option>
            <option value="arts">Arts</option>
            <option value="photography">Photography</option>
            <option value="videography">VideoGraphy</option>
            <option value="graphic-design">GraphicDesign</option>
            <option value="comedy">Comedy</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="w-full flex flex-col">
          <label htmlFor="address" className="mb-2 text-lg">
            Address
          </label>
          <input
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
            required
          />
        </div>

        <div className="w-full flex flex-col">
          <label htmlFor="creative_name" className="mb-2 text-lg">
            Creative Name
          </label>
          <input
            type="text"
            id="creative_name"
            value={formData.creative_name}
            onChange={handleChange}
            placeholder="Your creative/stage name"
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
          />
        </div>

        <div className="w-full flex flex-col">
          <label htmlFor="social_media" className="mb-2 text-lg">
            Social Media Handle
          </label>
          <input
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            type="text"
            id="social_media"
            value={formData.social_media}
            onChange={handleChange}
            placeholder="e.g., @yourhandle"
          />
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="link_to_project " className="capitalize mb-2 text-lg">
            Link to project
          </label>
          <input
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            type="text"
            id="link_to_project"
            value={formData.link_to_project}
            onChange={handleChange}
            placeholder="e.g., #project_url"
          />
        </div>
        <div className="w-full flex flex-col">
          <label htmlFor="link_to_profile" className="mb-2 text-lg capitalize">
            link to profile
          </label>
          <input
            className="p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 ease-in-out text-white"
            type="text"
            id="link_to_profile"
            value={formData.link_to_profile}
            onChange={handleChange}
            placeholder="e.g., #profile_url"
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-green-400 hover:to-green-500 text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-400/50 cursor-pointer transition-transform transform hover:scale-102 duration-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Register Now!"}
        </button>
      </form>
      <div className=""></div>
    </div>
  );
};

export default EventForm;
