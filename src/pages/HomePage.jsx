import React, { useState, useEffect } from "react";
import { MdOutlineTravelExplore } from "react-icons/md";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/supabase_client";
import { PiEmpty } from "react-icons/pi";
import Explore2 from "./Explore/Explore2";
import Feature2 from "./Feature/Feature2";
import Events2 from "./Event/Events2";
import TmBlogs2 from "./Magazine/tmblogs/TmBlogs2";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [cateItems, setCateItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("hero-bg")
          .select("image, description")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setImages(
          data?.map((item) => ({
            url: item.image,
            desc: item.description,
          })) || []
        );
      } catch (err) {
        console.error("Error fetching hero images:", err.message);
        setError("Failed to load hero images");
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchCateImages = async () => {
      try {
        const { data, error } = await supabase
          .from("cate")
          .select("id, image, category")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCateItems(
          data?.map((item) => ({
            id: item.id,
            url: item.image,
            category: item.category,
          })) || []
        );
      } catch (err) {
        console.error("Error fetching category images:", err.message);
        setError("Failed to load category images");
      }
    };

    fetchCateImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#000000]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-lg">Loading.....</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }
  const paddedCateItems = [...cateItems];
  while (paddedCateItems.length < 4) {
    paddedCateItems.push({
      id: `placeholder-${paddedCateItems.length}`,
      image: null,
      category: "",
    });
  }

  return (
    <div className="min-h-screen">
      {/* Landing Page */}
      <div className="min-h-screen w-full">
        {images.length > 0 && (
          <div
            className="bg-cover bg-center min-h-screen w-full"
            style={{ backgroundImage: `url(${images[0].url})` }}
          >
            <div className="bg-cover backdrop-blur-xs flex justify-center bg-center w-full">
              <div className="flex w-4xl flex-col justify-center min-h-screen items-center text-center px-4">
                <p className="text-3xl md:text-7xl p-6 rounded-xl capitalize text-center font-semibold text-white">
                  {images[0].desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explore Section */}
      <div className="px-6 py-12">
        <div className="mx-auto">
          <h2 className="text-4xl font-bold capitalize text-center mb-12">
            <div className="flex justify-center items-center gap-2">
              <span>Explore Liberian's Creative Heartbeat</span>
              <MdOutlineTravelExplore />
            </div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {paddedCateItems.map((item) =>
              item.url ? (
                <div
                  key={item.id}
                  className="rounded-md border-2 border-red-500 cursor-pointer shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link
                    to={`/explore?category=${
                      item.category?.toLowerCase() || ""
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.category || "Category image"}
                      className="w-full h-56 object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                    />
                    <div className="p-6 text-center">
                      <p className="text-3xl capitalize font-semibold hover:text-red-500 transition-colors duration-300">
                        {item.category || "Uncategorized"}
                      </p>
                    </div>
                  </Link>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="min-h-[224px] flex justify-center items-center gap-2 border-2 p-4 border-red-500 rounded-md  bg-gray-800  "
                >
                  empty <PiEmpty />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Explore2 />
      <Feature2 />
      <Events2/>
      <TmBlogs2/>
    </div>
  );
};

export default HomePage;
