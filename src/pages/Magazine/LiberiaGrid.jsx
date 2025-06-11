import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase_client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FeaturedTM from "./FeaturedTM";

const LiberiaGrid = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const gridItems = [
    {
      id: 1,
      title: "The New Liberia",
      description:
        "Exploring a nation on the rise as Liberia embraces its future while honoring its heritage.",
      category: "Spotlight",
      image:
        "https://images.pexels.com/photos/1251171/pexels-photo-1251171.jpeg",
      cols: "lg:col-span-2",
      buttonText: "Read Feature",
    },
    {
      id: 2,
      title: "",
      image:
        "https://images.pexels.com/photos/2218239/pexels-photo-2218239.jpeg",
      cols: "",
      buttonText: "Musics",
    },
    {
      id: 3,
      title: "",
      image:
        "https://images.pexels.com/photos/2218239/pexels-photo-2218239.jpeg",
      cols: "",
      buttonText: "Fashion",
    },
    {
      id: 4,
      title: "",
      image:
        "https://images.pexels.com/photos/2218239/pexels-photo-2218239.jpeg",
      cols: "",
      buttonText: "Photography",
    },
    {
      id: 5,
      title: "",
      image:
        "https://images.pexels.com/photos/2218239/pexels-photo-2218239.jpeg",
      cols: "",
      buttonText: "Arts",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .limit(4);

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const GridSkeleton = () => (
    <div className="mx-auto px-4 bg-gray-50 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-white rounded-2xl overflow-hidden p-4 md:p-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] min-h-[250px] sm:min-h-[300px]"
            >
              <Skeleton height="100%" borderRadius="0.75rem" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-h-[200px]">
              <Skeleton height="100%" borderRadius="1rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <GridSkeleton />;
  }

  return (
    <div className="mx-auto px-4 bg-gray-50 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Posts Section */}
        <FeaturedTM className="lg:col-span-2" />

        {/* Categories Section */}
        <div className="grid grid-cols-2 gap-6">
          {gridItems.slice(1).map((item) => (
            <Link
              to={`/tm?category=${item.buttonText.toLowerCase()}`}
              key={item.id}
              className="group relative h-full min-h-[200px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-6">
                <p className="px-6 py-2 bg-white/90 hover:bg-white text-gray-900 font-medium rounded-full transition-all duration-300 hover:translate-y-1">
                  {item.buttonText}
                </p>
              </div>
              <h2 className="absolute top-6 left-6 text-2xl font-bold text-white drop-shadow-lg">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};



export default LiberiaGrid;
