import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase_client";
import { toast } from "react-toastify";

const FeaturedTMAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("tm")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;

        setPosts(data);

        // Preselect featured posts
        const featured = data.filter((post) => post.is_featured);
        setSelectedIds(featured.map((post) => post.id));
      } catch (error) {
        toast.error("Error fetching posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const togglePost = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= 4) {
        toast.warning("You can select up to 4 posts only");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const saveFeaturedPosts = async () => {
    setSaving(true);

    try {
      // Step 1: Reset all featured flags to false
      const { error: resetError } = await supabase
        .from("tm")
        .update({ is_featured: false })
        .neq("is_featured", false); // only update those currently featured

      if (resetError) throw resetError;

      // Step 2: Set selected posts to is_featured = true
      const { error: updateError } = await supabase
        .from("tm")
        .update({ is_featured: true })
        .in("id", selectedIds);

      if (updateError) throw updateError;

      toast.success("Featured posts updated!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update featured posts");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-400">Loading posts...</p>;

  return (
    <div className="p-6  min-h-full border border-gray-700 rounded-2xl text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-red-500 mb-6">
        Select up to 4 Featured Posts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => togglePost(post.id)}
            className={`cursor-pointer border rounded-lg p-4 transition select-none ${
              selectedIds.includes(post.id)
                ? "border-red-500 bg-gray-800 "
                : "border-gray-700 bg-gray-800"
            }`}
          >
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-300">
              {post.description?.slice(0, 60)}...
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={saveFeaturedPosts}
        disabled={saving}
        className="mt-6 px-6 py-4 text-xl bg-red-500 w-full cursor-pointer hover:bg-red-600 text-black font-bold rounded-lg"
      >
        {saving ? "Saving..." : "Save Featured Posts"}
      </button>
    </div>
  );
};

export default FeaturedTMAdmin;
