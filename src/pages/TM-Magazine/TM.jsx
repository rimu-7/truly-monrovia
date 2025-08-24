import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Search } from "lucide-react";
import { supabase } from "../../../supabase/supabase_client";
import Navbar from "../../Shared/Navbar";
import MagazineNavbar from "../Magazine/MagazineNavbar";

const TM = () => {
  const [tm, setTM] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get("category");

    if (
      categoryFromUrl &&
      categories.some((cat) => cat.id === categoryFromUrl)
    ) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search]);

  const categories = [
    { id: "all", name: "All" },
    { id: "popular", name: "Popular " },
    { id: "music", name: "Music" },
    { id: "fashion", name: "Fashion" },
    { id: "arts", name: "Arts" },
    { id: "photography", name: "Photography" },
    { id: "others", name: "Others" },
  ];

  useEffect(() => {
    const fetchFeaturePosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tm")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setTM(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error("Error fetching feature posts:", error);
        toast.error("Failed to load featured posts");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturePosts();
  }, [navigate]);

  useEffect(() => {
    let results = [...tm];

    // Apply category filter
    if (selectedCategory !== "all" && selectedCategory !== "popular") {
      results = results.filter((post) => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.category?.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(results);
  }, [selectedCategory, searchQuery, tm]);

  const handleReadMore = async (postId) => {
    try {
      navigate(`/tm/${postId}`);
    } catch (error) {
      console.error("Error navigating to post:", error);
      toast.error("Failed to open post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  if (!tm || tm.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className="">
      <MagazineNavbar />
      <section className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 pt-48">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">TM Magazine</h2>
          <p className="mt-4 text-xl text-gray-300">
            Discover our latest and most popular content
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts by title, description, or category..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${
                                  selectedCategory === category.id
                                    ? "bg-[#FFD700] text-gray-900"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <article
              key={index}
              className="border-2 border-yellow-300 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image1}
                  alt={post.title || "Featured post"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-[#FFD700] text-gray-900 px-2 py-1 rounded-md text-sm font-bold">
                  {post.category}
                </div>
              </div>

              <div className="px-4 py-2">
                <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                  <time dateTime={new Date(post.created_at).toISOString()}>
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {post.title || "Untitled Post"}
                </h3>
                <p className="text-gray-300 line-clamp-3">
                  {(post.description || "No description available").length > 70
                    ? (
                        post.description || "No description available"
                      ).substring(0, 70) + "..."
                    : post.description || "No description available"}
                </p>
                <div className="flex mt-2 justify-center items-center">
                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="w-full bg-white hover:bg-[#FDD700] cursor-pointer text-black px-3 py-2 rounded-md transition-transform duration-300"
                  >
                    <span className="inline-flex transition-transform items-center justify-center duration-300 hover:translate-x-3">
                      Read more
                      <ArrowRight />
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
    </div>
  );
};

export default TM;
