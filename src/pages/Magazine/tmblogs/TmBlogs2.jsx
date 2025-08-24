import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../../supabase/supabase_client";
import MagazineNavbar from "../MagazineNavbar";

const TmBlogs2 = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from("tmblog")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6); // fetch only latest 6

        if (error) throw error;

        setLatestBlogs(data || []);
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
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
        <p className="text-lg text-gray-700">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className=" px-5 py-10 mx-auto">
        <h3 className="text-4xl font-bold mb-6 pb-2">TM Blogs</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestBlogs.map((blog) => (
            <div key={blog.id} className="flex flex-col group cursor-pointer">
              {blog.image1 && (
                <div className="overflow-hidden">
                  <img
                    src={blog.image1}
                    alt={blog.title}
                    className="w-full h-96 object-cover transform transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="mt-4 flex flex-col">
                <p className="text-sm text-gray-500 mb-1">{blog.category}</p>
                <h3 className="text-2xl font-semibold text-red-500 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-300 text-lg line-clamp-3 mb-4">
                  {blog.description1}
                </p>
                <Link
                  to={`/tm-magazine/tmblog/${blog.id}`}
                  className="w-full bg-white hover:bg-red-500 cursor-pointer text-center duration-300 text-black px-3 py-2  transition-transform"
                >
                  <p className="hover:translate-x-3 duration-300">Read More →</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TmBlogs2;
