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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
        <p className="text-lg text-white">Loading.....</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className=" w-full">        
        {/* Carousel Section */}
        {images.length > 1 && (
          <div className="w-full mx-auto ">
            <Carousel
              showThumbs={false}
              infiniteLoop
              autoPlay
              interval={3000}
              showStatus={true}
              className=" overflow-hidden"
            >
              {images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img.url}
                    alt={`carousel-img-${i}`}
                    className="h-[900px] w-full object-cover"
                  />
                  {/* Description Overlay */}
                  <div className="absolute inset-0  flex  items-center w-96">
                    <p className="text-2xl md:text-4xl font-semibold text-white text-left px-4">
                      {img.desc}
                    </p>
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
