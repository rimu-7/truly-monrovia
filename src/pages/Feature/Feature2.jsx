import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase_client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Search } from "lucide-react";

const Feature = () => {
  const [feature, setFeature] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchFeaturePosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("feature")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6); // ✅ fetch only 6 latest posts

      if (error) throw error;

      setFeature(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error("Error fetching feature posts:", error);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  fetchFeaturePosts();
}, []);


  useEffect(() => {
    let results = [...feature];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (post) =>
          post.title?.toLowerCase().includes(q) ||
          post.description?.toLowerCase().includes(q) ||
          post.category?.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(results);
  }, [selectedCategory, searchQuery, feature]);

  const handleReadMore = (postId) => {
    navigate(`/postview/${postId}`);
  };

  if (!feature.length) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-gray-600 text-lg">No featured posts available</p>
      </div>
    );
  }

  return (
    <section className=" mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className=" mb-8">
        <h2 className="font-bold text-4xl">Feature Posts</h2>
        
      </div>


      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className=" shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative h-96 overflow-hidden">
              <img
                src={post.image1}
                alt={post.title || "Featured post"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-red-500 text-gray-900 px-2 py-1 rounded-md text-sm font-bold">
                {post.category}
              </div>
            </div>

            <div className="px-4 py-2">
              <div className="text-sm flex justify-between items-center text-gray-300 mb-2">
                <time dateTime={new Date(post.created_at).toISOString()}>
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>views {post.count}</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                {(post.title || "Untitled Post").length > 50
                  ? (post.title || "No Title available ").substring(0, 50) +
                    "...."
                  : post.title || "No Title"}
              </h3>
              <p className="text-gray-300 line-clamp-3">
                {(post.description || "No description available").length > 70
                  ? (post.description || "No description available").substring(
                      0,
                      70
                    ) + "..."
                  : post.description || "No description available"}
              </p>
              <div className="flex mt-2 justify-center items-center">
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="w-full bg-gray-100 hover:bg-red-500 text-black px-3 py-2 transition-transform duration-300 cursor-pointer"
                >
                  <span className="inline-flex items-center justify-center gap-2 duration-300 hover:translate-x-3">
                    Read more <ArrowRight />
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">
            No posts found matching your criteria
          </p>
        </div>
      )}
    </section>
  );
};

export default Feature;
