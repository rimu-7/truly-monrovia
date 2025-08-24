import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase_client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MasonryGallery = () => {
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("image-library")
        .select("image, description")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error.message);
        setLoading(false);
        return;
      }

      const formatted = data.map((item) => ({
        url: item.image,
        desc: item.description,
      }));

      setImages(formatted);
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (!loading && (!images || images.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-300 text-lg">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl py-36 mx-auto min-h-screen">
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {loading
          ? // Show 8 skeleton blocks while loading
            [...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="break-inside-avoid rounded-lg shadow-md overflow-hidden"
              >
                <Skeleton
                  height={250}
                  baseColor="#2d3748"
                  highlightColor="#4a5568"
                  className="rounded-lg"
                />
                <Skeleton
                  height={20}
                  width="60%"
                  className="mt-2 mx-2"
                  baseColor="#2d3748"
                  highlightColor="#4a5568"
                  borderRadius={4}
                />
              </div>
            ))
          : images.map((img, index) => (
              <div
                key={index}
                className="relative cursor-pointer break-inside-avoid group"
                onClick={() => setFullscreenImage(img)}
              >
                <img
                  src={img.url}
                  alt={`img-${index}`}
                  className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02] hover:border-2 hover:border-red-500"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded">
                  {img.desc}
                </div>
              </div>
            ))}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage.url}
            alt="fullscreen"
            className="max-w-full max-h-full rounded-lg shadow-xl"
          />
          <div className="absolute bottom-8 text-white text-xl font-semibold">
            {fullscreenImage.desc}
          </div>
        </div>
      )}
    </div>
  );
};

export default MasonryGallery;
