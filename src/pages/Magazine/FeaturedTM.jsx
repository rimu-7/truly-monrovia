import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase_client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdWorkspacePremium } from "react-icons/md";

const FeaturedTM = ({ className }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        // First try to get featured posts
        let { data: featuredData, error: featuredError } = await supabase
          .from("tm")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(4);

        // If no featured posts, get recent posts instead
        if (!featuredData || featuredData.length === 0) {
          const { data: recentData, error: recentError } = await supabase
            .from("tm")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(4);

          if (recentError) throw recentError;
          setPosts(recentData || []);
        } else {
          if (featuredError) throw featuredError;
          setPosts(featuredData);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const handleReadMore = async (postId) => {
    try {
      await supabase.rpc("increment_count", {
        post_id: postId,
      });
      navigate(`/tm/${postId}`);
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`${className} grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-white rounded-2xl overflow-hidden p-4 md:p-6`}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] min-h-[250px] sm:min-h-[300px] rounded-xl overflow-hidden"
          >
            {/* Image skeleton only */}
            <Skeleton
              height="100%"
              width="100%"
              borderRadius="0"
              className="absolute inset-0"
            />

            {/* Simulated content area (not skeleton) */}
            <div className="relative z-10 h-full flex flex-col justify-between p-4 bg-transparent">
              <div className="self-end">
                <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div>
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${className} grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 p-4 md:p-6`}
    >
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} handleReadMore={handleReadMore} />
        ))
      ) : (
        <div className="col-span-2 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">No posts available</p>
        </div>
      )}
    </div>
  );
};

const PostCard = ({ post, handleReadMore }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => handleReadMore(post.id)}
      className="group relative aspect-[4/3] min-h-[250px] sm:min-h-[300px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      aria-label={`Read more about ${post.title}`}
    >
      {/* Image with loading states */}
      {!imageError ? (
        <img
          src={post.image1}
          alt={post.title}
          className={`w-full h-full object-cover brightness-90 group-hover:brightness-95 transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image not available</span>
        </div>
      )}

      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}

      {/* Rest of your card content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-between p-4 md:p-6">
        <div className="flex justify-end relative">
          <span className="px-3 py-1 md:px-4 md:py-2 bg-gray-600/70 text-gray-100 text-xs md:text-sm font-medium rounded-full shadow-sm">
            <p>SPOTLIGHT</p>
          </span>
          <MdWorkspacePremium className="absolute top-[-15px] right-[-10px] rounded-full text-4xl text-yellow-400 transform translate-x-1 -translate-y-1" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 drop-shadow-lg line-clamp-2">
            {post.title}
          </h2>
          <p className="text-xs md:text-sm text-white/80">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
        <span className="text-white font-medium text-sm md:text-base bg-black/70 px-4 py-2 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Read More
        </span>
      </div>
    </div>
  );
};

export default FeaturedTM;
