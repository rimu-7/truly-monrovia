import React from "react";

const Card = () => {
  return (
    <div className="py-20">
      <div className="relative overflow-hidden group max-w-6xl mx-auto">
        {/* Image */}
        <img
          src="card-1.png"
          alt=""
          className="group-hover:scale-110 duration-300 h-auto"
        />
        <div className="absolute inset-0 flex flex-col justify-center w-full mx-auto items-center text-white bg-black/20  duration-300 p-4 text-center"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center w-[35%] mx-auto items-center text-white duration-300 p-4 text-center">
          <p className="text-2xl md:text-4xl font-semibold mb-2">
            Contrary to popular belief, Lorem Ipsum is not simply random text.
          </p>
          <p className="text-xl md:text-2xl font-semibold mb-2">personal info</p>
          <p className="text-lg md:text-xl">additional info</p>
        </div>
      </div>
    </div>
  );
};

export default Card;

