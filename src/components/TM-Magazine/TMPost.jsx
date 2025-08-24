import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../../supabase/AuthContext";
import { supabase } from "../../../supabase/supabase_client";
import TMList from "./TMList";
import FeaturedTMAdmin from "./FeaturedTMAdmin";
import TMBg from "./TMBg";

const TMPost = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Default");
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { value: "music", label: "Music" },
    { value: "fashion", label: "Fashion" },
    { value: "arts", label: "Arts" },
    { value: "photography", label: "Photography" },
    { value: "others", label: "Others" },
    { value: "Default", label: "Select" },
  ];

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
    if (images.length >= 3) {
      return toast.warning("Maximum 3 images allowed");
    }

    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, 3);
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

      const { error } = await supabase.from("tm").insert([
        {
          new_id: adminId,
          image1: imageUrls[0] || null,
          image2: imageUrls[1] || null,
          image3: imageUrls[2] || null,
          title,
          description,
          category,
        },
      ]);

      if (error) throw error;

      toast.success("TM Magazine created successfully!");
      setImages([]);
      setPreviews([]);
      setTitle("");
      setDescription("");
      setCategory("others");
    } catch (error) {
      toast.error("Failed to create TM Magazine");
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
    <div className="max-w-7xl min-h-full  flex flex-col gap-10 justify-center items-center mx-auto bg-[#212121]">
      <div className="w-full max-w-4xl p-10 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
          Create TM Magazine Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div>
            <label className="block text-xl font-medium text-gray-300 mb-4">
              Upload Images (Max 3)
            </label>

            <div className="flex flex-wrap gap-4 mb-6">
              {previews.length > 0 ? (
                previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="h-40 w-40 rounded-lg overflow-hidden border-2 border-red-500 bg-gray-800 flex items-center justify-center">
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

            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-red-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
              <div className="flex flex-col items-center justify-center p-5">
                <UploadCloud className="w-10 h-10 mb-3 text-red-500" />
                <p className="mb-2 text-lg text-gray-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG (MAX. 3 images)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={images.length >= 3}
              />
            </label>
          </div>

          {/* Title Section */}
          <div>
            <label
              htmlFor="title"
              className="block text-xl font-medium text-gray-300 mb-4"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 bg-gray-800  rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
              placeholder="Write a title for your post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category Section */}
          <div>
            <label
              htmlFor="category"
              className="block text-xl font-medium text-gray-300 mb-4"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-3 bg-gray-800  rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description Section */}
          <div>
            <label
              htmlFor="description"
              className="block text-xl font-medium text-gray-300 mb-4"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              className="w-full px-4 py-3 bg-gray-800  rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
              placeholder="Write a compelling description about these images..."
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
              className={`px-8 py-4 text-xl font-bold rounded-full transition-colors flex items-center gap-2
                ${isUploading || images.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-gray-900 hover:scale-105 transform transition"
                }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  Uploading...
                </>
              ) : (
                "Publish TM Magazine"
              )}
            </button>
          </div>
        </form>
      </div>
      <TMBg/>
      <FeaturedTMAdmin/>
      <TMList />
    </div>
  );
};

export default TMPost;