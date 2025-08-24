import React from "react";

const Card = () => {
  return (
    <div className="py-20">
      <div className="relative overflow-hidden group max-w-6xl mx-auto rounded-2xl shadow-lg">
        {/* Image */}
        <img
          src="card-1.png"
          alt="Card Banner"
          className="group-hover:scale-110 transform transition duration-700 ease-in-out h-auto w-full object-cover"
        />

        {/* Overlay (darkens on hover) */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-500"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center text-white">
          <p className="text-2xl md:text-4xl font-semibold mb-4 transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
            Contrary to popular belief, Lorem Ipsum is not simply random text.
          </p>
          <p className="text-lg md:text-2xl font-medium mb-2 opacity-80 group-hover:opacity-100 transition duration-700 delay-100">
            Personal Info
          </p>
          <p className="text-md md:text-lg opacity-70 group-hover:opacity-100 transition duration-700 delay-200">
            Additional Info
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
