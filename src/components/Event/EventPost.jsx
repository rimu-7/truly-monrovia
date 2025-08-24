import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../../supabase/AuthContext";
import { supabase } from "../../../supabase/supabase_client";
import EventList from "./EventList";

const EventPost = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchAdminId = async () => {
      if (!session) {
        navigate("/login");
        return toast.error("Only admin can access this");
      }

      try {
        const { data, error } = await supabase
          .from("admin")
          .select("new_id")
          .eq("email", session.user.email)
          .single();

        if (error || !data?.new_id) {
          throw new Error("Admin not found");
        }

        setAdminId(data.new_id);
      } catch (error) {
        toast.error("Failed to verify admin access");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminId();
  }, [session, navigate]);

  const handleImageChange = (e) => {
    if (images.length >= 1) {
      return toast.warning("Maximum 1 image allowed");
    }

    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 1);
    setImages(newImages);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trulymonrovia");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/ddssf6cm6/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return toast.warning("Please upload at least one image");
    }

    setIsUploading(true);

    try {
      const imageUrls = await Promise.all(
        images.map((file) => uploadToCloudinary(file))
      );

      const { error } = await supabase.from("event-posts").insert([
        {
          new_id: adminId,
          image: imageUrls[0] || null,
          title,
          description,
          location,
          date,
        },
      ]);

      if (error) throw error;

      toast.success("Event created successfully!");
      setImages([]);
      setPreviews([]);
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
    } catch (error) {
      toast.error("Failed to create event");
      console.error("Submission error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-h-screen flex flex-col gap-10 justify-center items-center mx-auto bg-[#212121] py-10">
      <div className="w-full max-w-4xl p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-8 text-center">
          Create Event Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-lg sm:text-xl font-medium text-gray-300 mb-3">
              Event Image
            </label>

            <div className="flex flex-wrap gap-4 mb-4">
              {previews.length > 0 ? (
                previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="h-40 w-full sm:w-64 rounded-lg overflow-hidden border-2 border-red-500 bg-gray-800 flex items-center justify-center">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-3 -right-3 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-full flex justify-center">
                  <ImageIcon className="h-20 w-20 text-gray-500" />
                </div>
              )}
            </div>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-red-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
              <div className="flex flex-col items-center justify-center p-4">
                <UploadCloud className="w-8 h-8 mb-2 text-red-500" />
                <p className="mb-1 text-sm sm:text-base text-gray-300 text-center">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  PNG, JPG (MAX. 1 image)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={images.length >= 1}
              />
            </label>
          </div>

          {/* Title Section */}
          <div>
            <label
              htmlFor="title"
              className="block text-lg sm:text-xl font-medium text-gray-300 mb-3"
            >
              Event Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
              placeholder="Enter event title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Date and Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date Section */}
            <div>
              <label
                htmlFor="date"
                className=" text-lg sm:text-xl font-medium text-gray-300 mb-3 flex items-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Event Date & Time
              </label>
              <input
                id="date"
                type="datetime-local"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Location Section */}
            <div>
              <label
                htmlFor="location"
                className=" text-lg sm:text-xl font-medium text-gray-300 mb-3 flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Event Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
                placeholder="Enter event location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg sm:text-xl font-medium text-gray-300 mb-3"
            >
              Event Description
            </label>
            <textarea
              id="description"
              rows={5}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-base sm:text-lg"
              placeholder="Describe your event details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isUploading || images.length === 0}
              className={`px-6 py-3 sm:px-8 sm:py-4 text-lg sm:text-xl font-bold rounded-full transition-colors flex items-center gap-2
                ${
                  isUploading || images.length === 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-gray-900 hover:scale-105 transform transition"
                }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-gray-900"></div>
                  Creating Event...
                </>
              ) : (
                "Publish Event"
              )}
            </button>
          </div>
        </form>
      </div>
      <EventList />
    </div>
  );
};

export default EventPost;
