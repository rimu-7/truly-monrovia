import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../../supabase/supabase_client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import TmBlogs from "./TmBlogs";

const TmBlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playVideos, setPlayVideos] = useState({}); // track which video is playing

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        let { data, error } = await supabase
          .from("tmblog")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-lg text-gray-700">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-medium">
        Blog not found.
      </div>
    );
  }

  // All images dynamically
  const images = [
    blog.image1,
    blog.image2,
    blog.image3,
    blog.image4,
    blog.image5,
  ].filter(Boolean);

  // First 3 images in carousel
  const carouselImages = images.slice(0, 3);
  // Remaining images (image4 & image5) for body
  const bodyImages = images.slice(3);

  // All video links dynamically
  const videos = [blog.video1, blog.video2, blog.video3].filter(Boolean);

  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 pt-56">
        {/* Image Carousel */}
        {carouselImages.length > 0 && (
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={5000}
            className="mb-8 overflow-hidden"
          >
            {carouselImages.map((img, i) => (
              <div key={i}>
                <img
                  src={img}
                  alt={`blog-img-${i}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{blog.category}</p>

        {/* Blog Content */}
        <div className="prose max-w-none text-lg leading-relaxed">
          {/* Description 1 */}
          {blog.description1 && <p className="mb-6">{blog.description1}</p>}

          {/* Video 1 */}
          {videos[0] && (
            <div className="mb-8 flex justify-center">
              {!playVideos[0] ? (
                <div
                  className="relative w-full cursor-pointer overflow-hidden shadow-lg"
                  onClick={() =>
                    setPlayVideos((prev) => ({ ...prev, 0: true }))
                  }
                >
                  <img
                    src={`https://img.youtube.com/vi/${extractVideoId(
                      videos[0]
                    )}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="p-4 rounded-full text-5xl hover:text-red-500">
                      ▶
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-96 rounded-2xl"
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    videos[0]
                  )}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}

          {/* Description 2 */}
          {blog.description2 && <p className="mb-6">{blog.description2}</p>}

          {/* Video 2 */}
          {videos[1] && (
            <div className="mb-8 flex justify-center">
              {!playVideos[1] ? (
                <div
                  className="relative w-full cursor-pointer overflow-hidden shadow-lg"
                  onClick={() =>
                    setPlayVideos((prev) => ({ ...prev, 1: true }))
                  }
                >
                  <img
                    src={`https://img.youtube.com/vi/${extractVideoId(
                      videos[1]
                    )}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="p-4 rounded-full text-5xl hover:text-red-500">
                      ▶
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-96 rounded-2xl"
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    videos[1]
                  )}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}
          {(blog.description4 || blog.description5) && (
            <div>
              {blog.description4 && <p className="mb-6">{blog.description4}</p>}
              {blog.description5 && <p className="mb-6">{blog.description5}</p>}
            </div>
          )}

          {/* Body Images (image4 & image5) */}
          {bodyImages.map((img, idx) => (
            <div key={idx} className="mb-8">
              <img
                src={img}
                alt={`blog-img-${idx + 4}`}
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
          ))}

          {/* Description 3 */}
          {blog.description3 && <p className="mb-6">{blog.description3}</p>}

          {/* Video 3 */}
          {videos[2] && (
            <div className="mb-8 flex justify-center">
              {!playVideos[2] ? (
                <div
                  className="relative w-full cursor-pointer overflow-hidden shadow-lg"
                  onClick={() =>
                    setPlayVideos((prev) => ({ ...prev, 2: true }))
                  }
                >
                  <img
                    src={`https://img.youtube.com/vi/${extractVideoId(
                      videos[2]
                    )}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="p-4 rounded-full text-5xl hover:text-red-500">
                      ▶
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-96 rounded-2xl"
                  src={`https://www.youtube.com/embed/${extractVideoId(
                    videos[2]
                  )}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}
        </div>
        <TmBlogs />
      </div>
    </div>
  );
};

export default TmBlogDetails;
