import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Search } from "lucide-react";
import { supabase } from "../../../../supabase/supabase_client";

const Musics = () => {
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
          .order("created_at", { ascending: false });

        if (error) throw error;

        setFeature(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error("Error fetching explore posts:", error);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl ">
            Feature Posts
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Discover our latest content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-2 border-gray-700 rounded-lg p-4 animate-pulse space-y-4"
            >      
              <div className="h-48 bg-gray-700 rounded-md w-full"></div>
              <div className="h-4 w-1/3 bg-gray-700 rounded-md"></div>
              <div className="h-3 w-1/4 bg-gray-700 rounded-md"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded-md"></div>
              <div className="h-3 w-full bg-gray-700 rounded-md"></div>
              <div className="h-3 w-5/6 bg-gray-700 rounded-md"></div>
              <div className="h-3 w-2/3 bg-gray-700 rounded-md"></div>
              <div className="h-10 w-full bg-gray-700 rounded-md mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!feature.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">No featured posts available</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold sm:text-4xl">Feature Posts</h2>
        <p className="mt-4 text-xl text-gray-300">
          Discover our latest content
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts by title, description, or category..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="border-2 border-red-500 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
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
                  className="w-full bg-white hover:bg-red-600 text-black px-3 py-2 rounded-md transition-transform duration-300 cursor-pointer"
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

export default Musics;
