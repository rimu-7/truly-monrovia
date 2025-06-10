import React, { useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, X } from "lucide-react";
import { supabase } from "../../supabase/supabase_client";
import { UserAuth } from "../../supabase/AuthContext";

const HeroBg = () => {
  const { session } = UserAuth();
  const [images, setImages] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 1 - images.length);
    if (files.length + images.length > 1) {
      toast.warning("Max 1 image allowed per upload.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setDescriptions((prev) => [...prev, ...files.map(() => "")]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleDescriptionChange = (index, value) => {
    const desc = value.trim().split(" ");
    if (desc.length > 40) return;
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newDescriptions = [...descriptions];
    const newPreviews = [...previews];

    newImages.splice(index, 1);
    newDescriptions.splice(index, 1);
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setDescriptions(newDescriptions);
    setPreviews(newPreviews);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trulymonrovia");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ddssf6cm6/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Only admin can upload");

    if (images.length === 0) return toast.warning("Upload at least one image");

    const invalidDesc = descriptions.some(
      (desc) => desc.trim().split(" ").length > 40
    );
    if (invalidDesc)
      return toast.error("Each description must be max 40 words");

    try {
      setUploading(true);

      const imageUrls = await Promise.all(images.map(uploadToCloudinary));

      const rows = imageUrls.map((url, idx) => ({
        image: url,
        description: descriptions[idx].trim(),
      }));

      const { error } = await supabase.from("hero-bg").insert(rows);
      if (error) throw error;

      toast.success("Images uploaded successfully!");

      // Reset
      setImages([]);
      setDescriptions([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] py-12 flex flex-col items-center px-4">
      <h1 className="text-4xl font-extrabold text-[#FFD700] mb-8 text-center">
        Upload HomePgae Backgraound Image & Description
      </h1>
      <p className="capitalize text-red-600">
        the picture must be a wide or landscape
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-10">
        {/* Image Previews with Description */}
        <div className="grid grid-cols-1 gap-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative mb-4">
              <div className="h-80 rounded-xl overflow-hidden border-2 border-[#FFD700] shadow-lg">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <textarea
                maxLength={200}
                placeholder="Max 200 characters"
                value={descriptions[idx]}
                onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                className="mt-3 w-full h-32 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
              />

              <button
                type="button"
                className="absolute top-2 right-2 bg-red-600 rounded-full p-2 hover:bg-red-700 transition duration-200"
                onClick={() => removeImage(idx)}
              >
                <X className="text-white h-6 w-6" />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Input */}
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#FFD700] rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition">
          <UploadCloud className="w-10 h-10 mb-3 text-[#FFD700]" />
          <p className="mb-1 text-lg text-gray-300">Click or Drag to Upload</p>
          <p className="text-sm text-gray-400">Max 1 image, JPG/PNG</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={images.length >= 1}
          />
        </label>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={uploading || images.length === 0}
            className={`px-8 py-4 text-xl font-bold rounded-full transition-all
              ${
                uploading || images.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 hover:scale-105"
              }`}
          >
            {uploading ? "Uploading BG Image..." : "Upload BG Image"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroBg;
