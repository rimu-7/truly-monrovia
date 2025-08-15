import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase_client";
import MagNav from "./MagNav";


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
        .select("image, description")
        .order("created_at", { ascending: false }); // Optional: newest first

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
        <p className="text-lg">Loading.....</p>
      </div>
    );
  }
  return (
    <div className="bg-gray-50">
     
      <div className="min-h-screen w-full">
        {images.length > 0 && (
          <div
            className="bg-cover bg-center min-h-screen w-full"
            style={{ backgroundImage: `url(${images[0].url})` }} // Use the first image as the background
          >
            {/* <MagNav/> */}
            <div className="bg-cover flex justify-center bg-center w-full">
              <div className="flex w-4xl  flex-col justify-center min-h-screen items-center text-center px-4">
                <p className="text-3xl md:text-7xl p-6 rounded-xl  capitalize text-center font-semibold text-white">
                  {images[0].desc}{" "}
                </p>
                {/* <p className=" bg-black/30  p-10 rounded-2xl mt-20 text-3xl text-red-500">
                  if you can see this text it's mean the website is still
                  underddeveloping, now only working pages list are:
                  <ul className="text-yellow-300 text-xl">
                    <li>1.Home</li>
                    <li>2.Explore</li>
                    <li>3.Feature</li>
                    <li>4.Event</li>
                    <li>5.Submit & B Seen</li>
                    <li>6.Library</li>
                    <li>7.About</li>
                    <li>8.TM-Magazine</li>
                  </ul>
                </p> */}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <img src="card-1.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default LiberiaCover;
