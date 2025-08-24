import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase_client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const LiberiaCover = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("tmbg")
        .select("image, description, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error.message);
        return;
      }

      const formatted = data.map((item) => ({
        url: item.image,
        desc: item.description,
      }));

      setImages(formatted);
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-lg text-white">Loading.....</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ✅ Add top offset for both navbars (main + magazine) */}
      <div className="pt-[86px] w-full">
        {images.length > 0 && (
          <div className="w-full mx-auto">
            <Carousel
              showThumbs={false}
              infiniteLoop
              autoPlay
              interval={4000}
              showStatus={false}
              swipeable
              emulateTouch
              className="overflow-hidden"
            >
              {images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    alt={`carousel-img-${i}`}
                    className="h-[800px] w-full object-cover transition-transform duration-700 ease-in-out"
                  />

                  {/* ✅ Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* ✅ Description Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center lg:justify-start">
                    <div className="max-w-3xl px-6 lg:px-12">
                      <p className="text-2xl md:text-5xl font-bold text-white leading-snug drop-shadow-lg animate-fadeInUp">
                        {img.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiberiaCover;
