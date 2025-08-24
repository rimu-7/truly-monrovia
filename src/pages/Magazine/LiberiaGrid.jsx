import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase/supabase_client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FeaturedTM from "./FeaturedTM";
import { PiEmpty } from "react-icons/pi";

const LiberiaGrid = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cateItems, setCateItems] = useState([]);
  const [error, setError] = useState(null);

  // Fetch 4 items from "cate" table
  useEffect(() => {
    const fetchCateImages = async () => {
      try {
        const { data, error } = await supabase
          .from("cate")
          .select("id, image, category")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setCateItems(data || []);
      } catch (err) {
        console.error("Error fetching cate items:", err.message);
        setError("Failed to load category images");
      } finally {
        setTimeout(() => setIsLoading(false), 700); // smooth delay
      }
    };

    fetchCateImages();
  }, []);

  // Pad cate items to 4
  const paddedCateItems = [...cateItems];
  while (paddedCateItems.length < 4) {
    paddedCateItems.push({
      id: `placeholder-${paddedCateItems.length}`,
      image: null,
      category: "",
    });
  }

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton height={400} className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                height={200}
                className="rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 bg-gray-50 sm:px-6 lg:px-8 py-12 transition-opacity duration-700 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Featured TM */}
        <FeaturedTM className="lg:col-span-2" />

        {/* Right: 4 items from 'cate' table */}
        <div className="grid bg-white rounded-2xl grid-cols-2 p-4 gap-6">
          {paddedCateItems.map((item) =>
            item.image ? (
              <div key={item.id} className="grid bg-white ">
                <Link
                  to={`/tm?category=${item.category.toLowerCase()}`}
                  className="group relative h-full min-h-[200px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <img
                    src={item.image}
                    alt={item.category}
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-6">
                    <p className="px-6 py-2 capitalize bg-white/90 hover:bg-white text-gray-900 font-medium rounded-full transition-all duration-300 hover:translate-y-1">
                      {item.category}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div
                key={item.id}
                className="min-h-[200px] rounded-2xl text-black flex justify-center items-center gap-2 bg-gray-200 opacity-40"
              >
                empty <PiEmpty />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LiberiaGrid;
