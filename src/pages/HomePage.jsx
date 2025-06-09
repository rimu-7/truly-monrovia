import { BookmarkCheck, MapPin } from "lucide-react";
import React, { useState, useEffect } from "react";
import { MdEventAvailable, MdOutlineTravelExplore } from "react-icons/md";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
        <p className="text-lg">Loading.....</p>
      </div>
    );
  }

  const explore = [
    {
      id: 1,
      name: "Music",
      image:
        "https://images.pexels.com/photos/2746823/pexels-photo-2746823.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 2,
      name: "Fashion",
      image:
        "https://images.pexels.com/photos/32114924/pexels-photo-32114924/free-photo-of-elegant-portrait-of-woman-in-black-dress.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 3,
      name: "Photography",
      image:
        "https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 4,
      name: "Visual Arts",
      image:
        "https://images.pexels.com/photos/1604991/pexels-photo-1604991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];
  const events = [
    {
      id: 1,
      title: "Tech Conference 2025",
      link: "/",
      date: "2025-06-10",
      location: "Shenzhen, China",
      image:
        "https://images.pexels.com/photos/1787220/pexels-photo-1787220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 2,
      title: "Music",
      link: "/",
      date: "2025-07-22",
      location: "Berlin, Germany",
      image:
        "https://images.pexels.com/photos/32096620/pexels-photo-32096620/free-photo-of-traditional-african-dance-with-musical-instruments.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 3,
      title: "Green Energy Summit",
      link: "/",
      date: "2025-08-15",
      location: "Nairobi, Kenya",
      image:
        "https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200",
    },
  ];

  return (
    <div className="min-h-screend">
      {/* landing-page */}
      <div className="bg-[url('https://images.pexels.com/photos/7520745/pexels-photo-7520745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center min-h-screen w-full">
        <div className="bg-cover backdrop-blur-xs flex justify-center bg-center w-full">
          <div className="flex w-[60%] flex-col justify-center min-h-screen items-center text-center px-4">
            <p className="text-3xl md:text-7xl capitalize font-semibold">
              Where Liberian culture lives, breathes, and shines
            </p>
            {/* <div className="capitalize flex flex-col md:flex-row gap-4 mt-4">
              <button className="capitalize bg-[#FFD700] text-black cursor-pointer hover:bg-yellow-400 duration-300 ease-in-out transition-colors px-4 py-2 text-center rounded-md">
                Discover Artist
              </button>
              <button className="capitalize bg-[#FFD700] text-black cursor-pointer hover:bg-yellow-400 duration-300 ease-in-out transition-colors px-4 py-2 text-center rounded-md">
                Stream Our Playlist
              </button>
              <button className="capitalize bg-[#FFD700] text-black cursor-pointer hover:bg-yellow-400 duration-300 ease-in-out transition-colors px-4 py-2 text-center rounded-md">
                Submit Your Works
              </button>
            </div> */}
            <p className=" bg-black  p-10 rounded-2xl mt-20 text-3xl text-red-500">
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
            </p>
          </div>
        </div>
      </div>

      {/* //explore  */}
      {/* // Explore */}
      <div className="px-6 py-12">
        <div className=" mx-auto">
          <h2 className="text-4xl font-bold capitalize text-center mb-12">
            <div className="flex justify-center items-center gap-2">
              <span>Explore Liberian's Creative Heartbeat</span>
              <MdOutlineTravelExplore />
            </div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {explore.map((item) => (
              <Link
                to={`/explore?category=${item.name.toLowerCase()}`}
                key={item.id}
              >
                <div className="rounded-md border-2 border-[#FFD700] cursor-pointer shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-56 object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                  />
                  <div className="p-6 text-center">
                    <p className="text-2xl font-semibold hover:text-[#FFD700] transition-colors duration-300">
                      {item.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* // Upcoming Events */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 ">
            <div className="flex justify-center items-center gap-2">
              <span>Upcoming events</span>
              <MdEventAvailable />
            </div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link to={event.link} key={event.id}>
                <div className="rounded-md border-2 border-[#FFD700] cursor-pointer shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-56 object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold  hover:text-[#FFD700] transition-colors duration-300 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 flex mb-1 hover:text-[#FFD700] duration-300">
                      <BookmarkCheck />
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 flex hover:text-[#FFD700] duration-300">
                      <MapPin /> {event.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
