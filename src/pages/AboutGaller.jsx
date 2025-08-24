import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase_client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { X } from "lucide-react";

const AboutGallery = () => {
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("aboutGallery")
        .select("image, description, position, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error.message);
        setLoading(false);
        return;
      }

      setImages(
        data.map((item) => ({
          url: item.image,
          desc: item.description,
          position: item.position,
        }))
      );
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (!loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="break-inside-avoid rounded-lg overflow-hidden"
              >
                <Skeleton height={260} className="mb-3" />
                <Skeleton height={20} width="80%" />
              </div>
            ))
          : images.map((img, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer break-inside-avoid overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all"
                onClick={() => setFullscreenImage(img)}
              >
                {/* Image */}
                <img
                  src={img.url}
                  alt={img.desc || `img-${idx}`}
                  className="w-full h-auto rounded-xl object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Texts BELOW the image */}
                {(img.desc || img.position) && (
                  <div className="mt-3 px-2 text-center">
                    <p className="text-base font-semibold text-red-500">
                      {img.desc}
                    </p>
                    {img.position && (
                      <p className="text-sm text-red-400">{img.position}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
          <button
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={fullscreenImage.url}
            alt={fullscreenImage.desc || "fullscreen"}
            className="max-w-[90%] max-h-[80vh] rounded-xl shadow-2xl object-contain"
          />
          {(fullscreenImage.desc || fullscreenImage.position) && (
            <div className="mt-4 text-center text-red-500">
              <p className="text-4xl font-semibold">{fullscreenImage.desc}</p>
              {fullscreenImage.position && (
                <p className="text-3xl text-red-400">
                  {fullscreenImage.position}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutGallery;
