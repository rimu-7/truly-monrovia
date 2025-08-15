import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, MoveLeft, MoveRight } from "lucide-react";
import { supabase } from "../../../supabase/supabase_client";

const TMView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tm")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, navigate]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Post not found</p>
      </div>
    );
  }

  const postImages = [post.image1, post.image2, post.image3].filter(Boolean);
  const hasMultipleImages = postImages.length > 1;

  return (
    <div className="max-w-7xl min-h-screen mx-auto">
      {/* Back Button */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-300 hover:text-yellow-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to TM Magazine</span>
        </button>
      </div>

      {/* Main Content */}
      <article className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Carousel */}
        <div className="relative mb-10 rounded-xl overflow-hidden  flex justify-center items-center">
          {postImages.length > 0 ? (
            <>
              <div className="relative  h-96 w-96">
                <img
                  src={postImages[activeImageIndex]}
                  alt={`${post.title} - Image ${activeImageIndex + 1}`}
                  className="w-full rounded-lg h-full object-cover"
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
                        index === activeImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-96 w-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex  justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              ``
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              {post.title}
            </h1>
            <p className="text-lg ">{post.description}</p>
          </header>
        </div>
      </article>
    </div>
  );
};

export default TMView;
