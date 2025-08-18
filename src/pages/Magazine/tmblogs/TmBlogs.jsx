import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../../supabase/supabase_client";
import MagazineNavbar from "../MagazineNavbar";

const categories = [
  "Fashion",
  "Music",
  "Arts",
  "Interview",
  "Best New Music",
  "Communities",
  "Culture Essential",
  "Film",
  "Politics",
  "Review",
  "Style",
  "Tech",
  "Shuffle",
  "Viral",
];

const TmBlogs = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        let { data, error } = await supabase
          .from("tmblog")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Latest 6 overall
        setAllBlogs((data || []).slice(0, 6));

        // Group blogs by category and take latest 3
        const grouped = {};
        categories.forEach((cat) => {
          grouped[cat] = (data || [])
            .filter((b) => b.category === cat)
            .slice(0, 3);
        });

        setBlogsByCategory(grouped);
      } catch (err) {
        console.error("Error fetching blogs:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-lg text-gray-700">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-5`">
      <MagazineNavbar />

      <div className="py-12 max-w-7xl mx-auto">
        {/* 🔹 Section 1: Latest 6 Blogs */}
        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          Latest Blogs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {allBlogs.map((blog) => (
            <div key={blog.id} className="flex flex-col group cursor-pointer">
              {blog.image1 && (
                <div className="overflow-hidden">
                  <img
                    src={blog.image1}
                    alt={blog.title}
                    className="w-full h-60 object-cover transform transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="mt-4 flex flex-col">
                <p className="text-sm text-gray-500 mb-1">{blog.category}</p>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-lg line-clamp-3 mb-4">
                  {blog.description1}
                </p>
                <Link
                  to={`/tm-magazine/tmblog/${blog.id}`}
                  className="mt-auto text-indigo-600 hover:text-indigo-800 font-medium text-lg transition"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Section 2: Latest 3 Blogs by Category */}

        {categories.map(
          (cat) =>
            blogsByCategory[cat]?.length > 0 && (
              <div key={cat} className="mb-16">
                <h3 className="text-4xl font-bold text-gray-800 mb-6 pb-2">
                  {cat}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {blogsByCategory[cat].map((blog) => (
                    <div
                      key={blog.id}
                      className="flex flex-col group cursor-pointer"
                    >
                      {blog.image1 && (
                        <div className="overflow-hidden">
                          <img
                            src={blog.image1}
                            alt={blog.title}
                            className="w-full h-60 object-cover transform transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="mt-4 flex flex-col">
                        <p className="text-sm text-gray-500 mb-1">
                          {blog.category}
                        </p>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-lg line-clamp-3 mb-4">
                          {blog.description1}
                        </p>
                        <Link
                          to={`/tm-magazine/tmblog/${blog.id}`}
                          className="mt-auto text-indigo-600 hover:text-indigo-800 font-medium text-lg transition"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default TmBlogs;
