import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase_client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdWorkspacePremium } from "react-icons/md";
import { PiEmpty } from "react-icons/pi";

const FeaturedTM = ({ className }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const { data: featuredData, error: featuredError } = await supabase
          .from("tm")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(4);

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

  const paddedPosts = [...posts];
  while (paddedPosts.length < 4) {
    paddedPosts.push({
      id: `placeholder-${paddedPosts.length}`,
      placeholder: true,
    });
  }

  return (
    <div
      className={`${className} grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 bg-white rounded-2xl overflow-hidden p-4 md:p-5`}
    >
      {isLoading
        ? [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] w-full rounded-xl overflow-hidden"
            >
              <Skeleton height="100%" width="100%" borderRadius="0" />
            </div>
          ))
        : paddedPosts.map((post) =>
            post.placeholder ? (
              <div
                key={post.id}
                className="aspect-[4/2] rounded-2xl text-black flex justify-center items-center  gap-2 bg-gray-200 opacity-40"
              >
                empty <PiEmpty />
              </div>
            ) : (
              <PostCard
                key={post.id}
                post={post}
                handleReadMore={handleReadMore}
              />
            )
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
      className="group relative aspect-[4/2] w-full rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
      aria-label={`Read more about ${post.title}`}
    >
      {!imageError ? (
        <img
          src={post.image1}
          alt={post.title}
          className={`w-full h-full object-cover brightness-90 group-hover:brightness-95 transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
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

      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-between p-3 sm:p-4">
        <div className="flex justify-end relative">
          <span className="px-3 py-1 bg-gray-600/70 text-white text-xs font-medium rounded-full">
            SPOTLIGHT
          </span>
          <MdWorkspacePremium className="absolute top-[-12px] right-[-8px] text-3xl text-yellow-400" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-xs text-white/80">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
        <span className="text-white text-xs sm:text-sm bg-black/70 px-3 py-1.5 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Read More
        </span>
      </div>
    </div>
  );
};

export default FeaturedTM;
