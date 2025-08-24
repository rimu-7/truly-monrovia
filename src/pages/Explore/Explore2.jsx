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

const Explore2 = () => {
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
          .order("created_at", { ascending: false })
          .limit(6); // ✅ fetch only 6 latest

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

    setFilteredPosts(results);
  }, [selectedCategory, explore]);

  const handleReadMore = (postId) => {
    navigate(`/explores/${postId}`);
  };

  return (
    <section className=" mx-auto px-4 sm:px-6 lg:px-8 py-10  text-white">
        <h1 className="text-4xl font-bold mb-8">Latest Blogs</h1>
      {/* Posts Grid or Skeleton */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden hover:shadow-red-500 transition-all duration-300"
            >
              <div className="relative h-96 overflow-hidden">
                <img
                  src={post.image1}
                  alt={post.title || "Featured post"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-red-400 text-gray-900 px-2 py-1 rounded-md text-sm font-bold">
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

                <h3 className="text-xl font-bold text-red-500 mt-2 leading-tight">
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
                    className="w-full bg-gray-100 hover:bg-red-500 text-black px-3 py-2 shadow hover:shadow-lg transition duration-300"
                  >
                    <span className="inline-flex items-center gap-2 hover:translate-x-3 duration-300">
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

export default Explore2;
