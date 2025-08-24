import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../../supabase/AuthContext";
import { supabase } from "../../../supabase/supabase_client";
import AdminBlogManager from "./AdminBlogManager";

const BlogUpload = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState(["", "", "", "", ""]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [videos, setVideos] = useState(["", "", ""]);
  const [uploading, setUploading] = useState(false);

  // Verify admin
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

        if (error || !data?.new_id) throw new Error("Admin not found");
        setAdminId(data.new_id);
      } catch (err) {
        toast.error("Failed to verify admin access");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminId();
  }, [session, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning("Max 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trulymonrovia");

    const res = await fetch("https://api.cloudinary.com/v1_1/ddssf6cm6/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Only admin can upload");
    if (!title || !category) return toast.error("Title & Category required");

    try {
      setUploading(true);
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await Promise.all(images.map(uploadToCloudinary));
      }

      const { error } = await supabase.from("tmblog").insert([
        {
          new_id: adminId,
          title,
          category,
          description1: descriptions[0],
          description2: descriptions[1],
          description3: descriptions[2],
          description4: descriptions[3],
          description5: descriptions[4],
          image1: imageUrls[0] || null,
          image2: imageUrls[1] || null,
          image3: imageUrls[2] || null,
          image4: imageUrls[3] || null,
          image5: imageUrls[4] || null,
          video1: videos[0] || null,
          video2: videos[1] || null,
          video3: videos[2] || null,
        },
      ]);

      if (error) throw error;
      toast.success("Blog uploaded successfully!");

      // Reset
      setTitle("");
      setCategory("");
      setDescriptions(["", "", "", "", ""]);
      setImages([]);
      setPreviews([]);
      setVideos(["", "", ""]);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
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
    <div className="max-w-7xl min-h-screen flex flex-col gap-10 py-20 justify-center items-center mx-auto bg-[#212121]">
      <div className="w-full max-w-4xl p-10 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
          Create Blog Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-xl font-medium text-gray-300 mb-4">Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xl font-medium text-gray-300 mb-4">Category</label>
            <select
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category...</option>
              <option value="Fashion">Fashion</option>
              <option value="Music">Music</option>
              <option value="Arts">Arts</option>
              <option value="Interview">Interview</option>
              <option value="Best New Music">Best New Music</option>
              <option value="Communities">Communities</option>
              <option value="Culture Essential">Culture Essential</option>
              <option value="Film">Film</option>
              <option value="Politics">Politics</option>
              <option value="Review">Review</option>
              <option value="Style">Style</option>
              <option value="Tech">Tech</option>
              <option value="Shuffle">Shuffle</option>
              <option value="Viral">Viral</option>
            </select>
          </div>

          {/* Descriptions */}
          {descriptions.map((desc, i) => (
            <div key={i}>
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Description {i + 1}
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={`Write description ${i + 1}...`}
                value={desc}
                onChange={(e) => {
                  const newDescs = [...descriptions];
                  newDescs[i] = e.target.value;
                  setDescriptions(newDescs);
                }}
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-xl font-medium text-gray-300 mb-4">Upload Images</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <div className="h-60 rounded-xl overflow-hidden border-2 border-red-500 shadow-lg">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  </div>
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

            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-red-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition mt-4">
              <UploadCloud className="w-10 h-10 mb-3 text-red-500" />
              <p className="mb-1 text-lg text-gray-300">Click or Drag to Upload</p>
              <p className="text-sm text-gray-400">Max 5 images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={images.length >= 5}
              />
            </label>
          </div>

          {/* Videos (URLs) */}
          {videos.map((vid, i) => (
            <div key={i}>
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Video {i + 1} (URL)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Paste video URL..."
                value={vid}
                onChange={(e) => {
                  const newVids = [...videos];
                  newVids[i] = e.target.value;
                  setVideos(newVids);
                }}
              />
            </div>
          ))}

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={uploading}
              className={`px-8 py-4 text-xl font-bold rounded-full transition-colors flex items-center gap-2
                ${uploading ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-gray-900 hover:scale-105 transform transition"}
              `}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6" />
                  Publish Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <AdminBlogManager/>
    </div>
  );
};

export default BlogUpload;
