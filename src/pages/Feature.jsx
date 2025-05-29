import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase_client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";

const Feature = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchFeaturePosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("feature-posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3); // Limit to 3 featured posts

        if (error) throw error;

        setFeatures(data || []);
      } catch (error) {
        console.error("Error fetching feature posts:", error);
        toast.error("Failed to load featured posts");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturePosts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center  min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <div className="flex justify-center items-center  min-h-screen">
        <p className="text-gray-600 text-lg">No featured posts available</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold  sm:text-4xl">
          Featured Posts
        </h2>
        <p className="mt-4 text-xl text-gray-300">
          Discover our latest and most popular content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {features.map((post, index) => (
          <article
            key={index}
            className="border-2 border-yellow-300 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={post.image1}
                alt={post.title || "Featured post"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-300 mb-2">
                <time dateTime={new Date(post.created_at).toISOString()}>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {post.title || "Untitled Post"}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {(post.description || "No description available").length > 70
                  ? (post.description || "No description available").substring(0, 70) + "..."
                  : (post.description || "No description available")}
              </p>
              <button
                onClick={() => navigate(`/postview/${post.id}`)}
                className="inline-flex items-center text-yellow-300 cursor-pointer hover:text-yellow-400 font-medium"
              >
                Read more <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
      {/* <div className="mt-12 text-center">
                <button
                    onClick={() => navigate("/blog")}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    View All Posts
                </button>
            </div> */}
    </section>
  );
};

export default Feature;