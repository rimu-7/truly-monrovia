import React from "react";
import { FaArrowRight, FaArrowRightArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const LiberiaGrid = () => {
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
      buttonText: "Art",
    },
  ];

  return (
    <div className=" mx-auto px-4 bg-gray-50 sm:px-6 lg:px-8 py-12">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadowtransition-all duration-500 group">
          <div className="h-96 overflow-hidden relative">
            <img
              src={gridItems[0].image}
              alt={gridItems[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          </div>
          <div className="p-8 bg-white">
            <p className="text-xl font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {gridItems[0].category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {gridItems[0].title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {gridItems[0].description}
            </p>
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-300 hover:translate-x-2 flex justify-center items-center items-center gap-2">
              {gridItems[0].buttonText}
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-2 gap-6">
          {gridItems.slice(1).map((item) => (
            <div
              key={item.id}
              className="group relative h-full min-h-[200px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-6">
                <Link
                  to={`/explore?category=${item.buttonText.toLowerCase()}`}
                  className="px-6 py-2 bg-white/90 hover:bg-white text-gray-900 font-medium rounded-full transition-all duration-300 hover:translate-y-1"
                >
                  {item.buttonText}
                </Link>
              </div>
              <h2 className="absolute top-6 left-6 text-2xl font-bold text-white drop-shadow-lg">
                {item.title}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiberiaGrid;
