import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../supabase/supabase_client";
import { UserAuth } from "../../supabase/AuthContext";

const CategoryBG = () => {
  const { session } = UserAuth();
  const [cateItems, setCateItems] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("cate")
      .select("id, category, image");

    if (error) {
      toast.error("Failed to fetch category images");
      return;
    }

    setCateItems(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Upload to Cloudinary
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

  // Handle updating image
  const handleImageUpdate = async (file, categoryId) => {
    if (!session) return toast.error("Only admin can upload");

    try {
      setUpdatingId(categoryId);
      const url = await uploadToCloudinary(file);

      const { error } = await supabase
        .from("cate")
        .update({ image: url })
        .eq("id", categoryId);

      if (error) throw error;

      toast.success("Image updated successfully");

      // Refresh just the updated image in local state
      setCateItems((prev) =>
        prev.map((item) =>
          item.id === categoryId ? { ...item, image: url } : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update image");
    } finally {
      setUpdatingId(null);
    }
  };

  // Trigger hidden file input
  const triggerFileInput = (index) => {
    document.getElementById(`file-input-${index}`).click();
  };

  return (
    <div className="min-h-screen bg-[#212121] py-12 px-4">
      <h1 className="text-4xl font-extrabold text-red-500 mb-10 text-center">
        Update Category Images
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cateItems.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border-2 border-red-500 pb-4 bg-gray-800 text-white text-center shadow-lg"
          >
            {/* Image with fallback */}
            {item.image ? (
              <img
                src={item.image}
                alt={item.category}
                className="aspect-[4/3] object-cover rounded-lg mb-4 w-full"
              />
            ) : (
              <div className="aspect-[4/3] bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-white text-xl">
                No Image
              </div>
            )}

            {/* Category name */}
            <p className="text-xl font-semibold capitalize mb-4">
              {item.category}
            </p>

            {/* Hidden input */}
            <input
              id={`file-input-${index}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImageUpdate(file, item.id);
              }}
            />

            {/* Upload button */}
            <button
              onClick={() => triggerFileInput(index)}
              disabled={updatingId === item.id}
              className={`px-4 py-2 rounded-lg cursor-pointer font-bold transition-all ${
                updatingId === item.id
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-red-500 text-black hover:bg-red-500 hover:scale-105"
              }`}
            >
              {updatingId === item.id ? "Updating..." : "Change Image"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBG;
