import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { supabase } from "../../../supabase/supabase_client";

const ExploreSuggestion = () => {
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const [explore, setExplore] = useState([]);
  

  useEffect(() => {
    const fetchSuggestedPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("explore-posts")
          .select("*")
          .order("count", { ascending: false })
          .limit(4);

        if (error) throw error;
        setSuggestedPosts(data || []);
      } catch (error) {
        console.error("Error fetching suggested posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton width={80} height={80} />
            <div className="flex-1">
              <Skeleton count={2} />
            </div>
          </div>
        ))}
      </div>
    );
  }
    const handleReadMore = async (postId) => {
      try {
        const { data: updatedPost, error } = await supabase.rpc(
          "increment_count",
          {
            post_id: postId,
          }
        );
  
        if (error) throw error;
  
        setExplore((prevExplore) =>
          prevExplore.map((post) =>
            post.id === postId ? { ...post, count: (post.count || 0) + 1 } : post
          )
        );
  
        navigate(`/explores/${postId}`);
      } catch (error) {
        console.error("Error updating count:", error);
        toast.error("Failed to update view count");
      }
    };

  return (
    <div className="sticky top-4">
      <h3 className="text-xl font-bold mb-4">Most Viewed</h3>
      <div className="space-y-4">
        {suggestedPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleReadMore(post.id)}
            className="flex gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <img
              src={post.image1}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg"
              loading="lazy"
            />
            <div>
              <h4 className="font-medium line-clamp-2">{post.title}</h4>
              <p className="text-sm text-gray-500">
                {post.count || 0} views
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSuggestion;