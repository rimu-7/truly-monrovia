import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase/supabase_client";
import { toast } from "react-toastify";
import { ArrowLeft, MoveLeft, MoveRight } from "lucide-react";
import ExploreSuggestion from "./ExploreSuggestion";

const ExploreView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Define image navigation functions first
  const nextImage = () => {
    if (!post) return;
    const images = [post.image1, post.image2, post.image3].filter(Boolean);
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!post) return;
    const images = [post.image1, post.image2, post.image3].filter(Boolean);
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const fetchAndIncrementPost = async () => {
      try {
        setLoading(true);
        
        // 1. First fetch the post
        const { data, error } = await supabase
          .from("explore")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // 2. Then increment the view count
        const { error: updateError } = await supabase
          .from("explore")
          .update({ count: (data.count || 0) + 1 })
          .eq("id", id);

        if (updateError) throw updateError;

        // 3. Set the post data with updated count
        setPost({ ...data, count: (data.count || 0) + 1 });

      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load post");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAndIncrementPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Post not found</p>
        <Link to="/explore" className="ml-4 text-red-500 hover:text-red-600">
          Back to Explore
        </Link>
      </div>
    );
  }

  const postImages = [post.image1, post.image2, post.image3].filter(Boolean);
  const hasMultipleImages = postImages.length > 1;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <div className="pt-6">
        <Link
          to="/explore"
          className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to explore</span>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Main Content (Left) */}
        <div className="lg:flex-1">
          {/* Image Carousel */}
          <div className="relative mb-10 rounded-xl overflow-hidden flex justify-center items-center bg-gray-800">
            {postImages.length > 0 ? (
              <>
                <div className="relative h-96 w-full">
                  <img
                    src={postImages[activeImageIndex]}
                    alt={`${post.title} - Image ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 ml-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all"
                      aria-label="Previous image"
                    >
                      <MoveLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 mr-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all"
                      aria-label="Next image"
                    >
                      <MoveRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {postImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === activeImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 w-full bg-gray-700 flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="mx-auto">
            <header className="mb-8">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-sm font-medium">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm">{post.count || 0} views</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-4 text-white">
                {post.title}
              </h1>
              <p className="text-lg text-gray-300 whitespace-pre-line">
                {post.description}
              </p>
            </header>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:w-80 xl:w-96">
          <ExploreSuggestion currentPostId={id} />
        </div>
      </div>
    </div>
  );
};

export default ExploreView;