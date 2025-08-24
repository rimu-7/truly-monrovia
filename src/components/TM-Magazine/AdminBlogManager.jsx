import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { Pencil, Trash2, Save, X, UploadCloud } from "lucide-react";
import { UserAuth } from "../../../supabase/AuthContext";
import { supabase } from "../../../supabase/supabase_client";

const AdminBlogManager = () => {
  const { session } = UserAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!session) return;
    fetchBlogs();
  }, [session]);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tmblog")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      toast.error("Failed to fetch blogs");
      console.error(error);
    } else {
      setBlogs(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    const { error } = await supabase.from("tmblog").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const startEditing = (blog) => {
    setEditingBlog(blog.id);
    setFormData({ ...blog });
    setPreviews([blog.image1].filter(Boolean));
  };

  const cancelEditing = () => {
    setEditingBlog(null);
    setFormData({});
    setNewImages([]);
    setPreviews([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImages([file]);
    setPreviews([URL.createObjectURL(file)]);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    try {
      let updatedData = { ...formData };
      if (newImages.length > 0) {
        const url = await uploadToCloudinary(newImages[0]);
        updatedData.image1 = url;
      }
      const { error } = await supabase
        .from("tmblog")
        .update(updatedData)
        .eq("id", editingBlog);
      if (error) throw error;
      toast.success("Blog updated");
      fetchBlogs();
      cancelEditing();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!session) return <p className="text-center text-red-500">Admin only</p>;
  if (loading)
    return <p className="text-center text-gray-400">Loading blogs...</p>;

  return (
    <div className="min-h-screen bg-[#212121] py-12 px-4 text-white">
      <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
        Manage Blogs
      </h1>
      <div className="max-w-6xl mx-auto space-y-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border border-gray-700 rounded-lg p-6 bg-gray-800 shadow-lg"
          >
            {editingBlog === blog.id ? (
              <div className="space-y-4">
                {/* Title & Category */}
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
                {/* <input type="text" name="category" value={formData.category || ""} onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-700 text-white" /> */}

                <label htmlFor="Description">Description</label>
                {/* Descriptions */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <textarea
                    key={i}
                    name={`description${i}`}
                    rows={3}
                    value={formData[`description${i}`] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                    placeholder={`Description ${i}`}
                  />
                ))}

                <label htmlFor="videos">videos</label>

                {/* Videos */}
                {[1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    name={`video${i}`}
                    value={formData[`video${i}`] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                    placeholder={`Video ${i} URL`}
                  />
                ))}

                {/* Image Upload */}
                {/* <div>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-red-500 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition mt-2">
                    <UploadCloud className="w-10 h-10 mb-3 text-red-500" />
                    <p className="mb-1 text-lg text-gray-300">Click or Drag to Upload</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {previews[0] && <img src={previews[0]} alt="preview" className="mt-3 w-full h-60 object-cover rounded-lg" />}
                </div> */}

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Save className="w-5 h-5" /> Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-2 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {blog.image1 && (
                  <img
                    src={blog.image1}
                    alt="blog"
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                {[1, 2, 3, 4, 5].map((i) => (
                  <p key={i} className="text-gray-400 mb-1">
                    {blog[`description${i}`]}
                  </p>
                ))}
                {[1, 2, 3].map(
                  (i) =>
                    blog[`video${i}`] && (
                      <p key={i} className="text-gray-300">
                        Video {i}: {blog[`video${i}`]}
                      </p>
                    )
                )}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => startEditing(blog)}
                    className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Pencil className="w-5 h-5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogManager;
