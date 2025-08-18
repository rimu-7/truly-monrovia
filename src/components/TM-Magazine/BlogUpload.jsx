import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../../supabase/AuthContext";
import { supabase } from "../../../supabase/supabase_client";

const BlogUpload = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [category, setCategory] = useState("");

  const [title, setTitle] = useState("");
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [desc3, setDesc3] = useState("");
  const [desc4, setDesc4] = useState("");
  const [desc5, setDesc5] = useState("");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");

  const [video1, setVideo1] = useState("");
  const [video2, setVideo2] = useState("");
  const [video3, setVideo3] = useState("");

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
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchAdminId();
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const { error } = await supabase.from("tmblog").insert([
        {
          new_id: adminId,
          title,
          category,
          description1: desc1,
          description2: desc2,
          description3: desc3,
          description4: desc4,
          description5: desc5,
          image1,
          image2,
          image3,
          image4,
          image5,
          video1,
          video2,
          video3,
        },
      ]);

      if (error) throw error;

      toast.success("Blog uploaded successfully!");
      setTitle("");
      setCategory("");
      setDesc1("");
      setDesc2("");
      setDesc3("");
      setDesc4("");
      setDesc5("");
      setImage1("");
      setImage2("");
      setImage3("");
      setImage4("");
      setImage5("");
      setVideo1("");
      setVideo2("");
      setVideo3("");
    } catch (error) {
      toast.error(error.message || "Failed to upload blog");
      console.error("Supabase error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-h-screen flex flex-col gap-10 py-20 justify-center items-center mx-auto bg-[#212121]">
      <div className="w-full max-w-4xl p-10 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-[#FFD700] mb-8 text-center">
          Create Blog Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-xl font-medium text-gray-300 mb-4">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-xl font-medium text-gray-300 mb-4">
              Category
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
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
          {[
            ["Description 1", desc1, setDesc1],
            ["Description 2", desc2, setDesc2],
            ["Description 3", desc3, setDesc3],
            ["Description 4", desc3, setDesc4],
            ["Description 5", desc3, setDesc5],
          ].map(([label, val, setter], i) => (
            <div key={i}>
              <label className="block text-xl font-medium text-gray-300 mb-4">
                {label}
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder={`Write ${label.toLowerCase()}...`}
                value={val}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}

          {/* Images */}
          {[
            ["Image 1", image1, setImage1],
            ["Image 2", image2, setImage2],
            ["Image 3", image3, setImage3],
            ["Image 4", image4, setImage4],
            ["Image 5", image5, setImage5],
          ].map(([label, val, setter], i) => (
            <div key={i}>
              <label className="block text-xl font-medium text-gray-300 mb-4">
                {label} (URL)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="Paste image URL..."
                value={val}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}

          {/* Videos */}
          {[
            ["Video 1", video1, setVideo1],
            ["Video 2", video2, setVideo2],
            ["Video 3", video3, setVideo3],
          ].map(([label, val, setter], i) => (
            <div key={i}>
              <label className="block text-xl font-medium text-gray-300 mb-4">
                {label} (URL)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="Paste video URL..."
                value={val}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-8 py-4 text-xl font-bold rounded-full transition-colors flex items-center gap-2
                ${
                  isUploading
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 hover:scale-105 transform transition"
                }`}
            >
              {isUploading ? (
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
    </div>
  );
};

export default BlogUpload;
