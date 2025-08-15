import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase_client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Search } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const categories = [
  { id: "all", name: "All" },
  { id: "popular", name: "Popular" },
  { id: "music", name: "Music" },
  { id: "fashion", name: "Fashion" },
  { id: "arts", name: "Arts" },
  { id: "photography", name: "Photography" },
  { id: "others", name: "Others" },
];

const Explore = () => {
  const [explore, setExplore] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = queryParams.get("category");
    if (
      categoryFromUrl &&
      categories.some((cat) => cat.id === categoryFromUrl)
    ) {
      setSelectedCategory(categoryFromUrl);
    }
  }, []);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("explore")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setExplore(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error("Error fetching explore posts:", error);
        toast.error("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchExplorePosts();
  }, []);

  useEffect(() => {
    let results = [...explore];

    if (selectedCategory === "popular") {
      results = [...results].sort((a, b) => b.count - a.count);
    } else if (selectedCategory !== "all") {
      results = results.filter((post) => post.category === selectedCategory);
    }

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
  }, [selectedCategory, searchQuery, explore]);

  const handleReadMore = (postId) => {
    navigate(`/explores/${postId}`);
  };

  return (
    <section className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-36  text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold sm:text-4xl text-yellow-400">
          Explore Posts
        </h2>
        <p className="mt-4 text-xl text-gray-400">
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
            className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === cat.id
                  ? "bg-yellow-400 text-gray-900 shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-yellow-300 hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid or Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-700  rounded-xl p-4 shadow-inner animate-pulse"
            >
              <Skeleton
                height={180}
                baseColor="#2d3748"
                highlightColor="#4a5568"
                className="rounded-lg"
              />
              <div className="py-3 space-y-2">
                <Skeleton
                  width="30%"
                  height={20}
                  baseColor="#2d3748"
                  highlightColor="#4a5568"
                  className="rounded-md"
                />
                <Skeleton
                  height={24}
                  baseColor="#2d3748"
                  highlightColor="#4a5568"
                  className="rounded-md"
                />
                <Skeleton
                  count={2}
                  baseColor="#2d3748"
                  highlightColor="#4a5568"
                  className="rounded-md"
                />
              </div>
              <Skeleton
                height={36}
                baseColor="#2d3748"
                highlightColor="#4a5568"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-900 border border-yellow-400 rounded-xl shadow-md overflow-hidden hover:shadow-yellow-300 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image1}
                  alt={post.title || "Featured post"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-md text-sm font-bold">
                  {post.category}
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="flex text-sm text-gray-400 justify-between items-center">
                  <time
                    dateTime={new Date(post.created_at).toISOString()}
                    className="italic"
                  >
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>views {post.count}</span>
                </div>

                <h3 className="text-xl font-bold text-yellow-400 mt-2 leading-tight">
                  {(post.title || "Untitled Post").length > 40
                    ? (post.title || " No Title available").substring(0, 50) +
                      "...."
                    : post.title || "No title available"}
                </h3>

                <p className="text-gray-300 text-sm mt-1 leading-relaxed line-clamp-3">
                  {(post.description || "No description available").length > 70
                    ? (
                        post.description || "No description available"
                      ).substring(0, 70) + "..."
                    : post.description || "No description available"}
                </p>

                <div className="flex mt-4 justify-center items-center">
                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 rounded-md shadow hover:shadow-lg transition duration-300"
                  >
                    <span className="inline-flex items-center gap-2">
                      Read more <ArrowRight />
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">
            No posts found matching your criteria
          </p>
        </div>
      )}
    </section>
  );
};

export default Explore;
