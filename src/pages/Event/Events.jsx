import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase_client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

const Events = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturePosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("event-posts")
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

  const handleReadMore = (postId) => {
    navigate(`/eventview/${postId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">No Events available</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-36">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold sm:text-4xl">Event Posts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((post, index) => (
          <article
            key={index}
            className="border-2 border-yellow-300 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title || "Featured post"}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
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
              <p className="text flex gap-2 mb-2 text-yellow-200">
                <Calendar /> Event Date: {post.date}
              </p>
              <p className="text flex gap-2 text-yellow-200">
                <MapPin /> Event Location: {post.location}
              </p>
              <p className="text-gray-300 line-clamp-3">
                {(post.description || "No description available").length > 70
                  ? (post.description || "No description available").substring(
                      0,
                      70
                    ) + "..."
                  : post.description || "No description available"}
              </p>
              <div className=" flex justify-center items-center">
                <button
                  onClick={() => handleReadMore(post.id)}
                  className=" w-full bg-white hover:bg-[#FDD700]  cursor-pointer text-black px-3 py-2 rounded-md transition-transform duration-300"
                >
                  <span className="inline-flex transition-transform items-center justify-center duration-300 hover:translate-x-3 ">
                    Read more
                    <ArrowRight />
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Events;
