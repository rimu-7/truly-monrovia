import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase_client";
import { toast } from "react-toastify";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";

const EventView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("event-posts")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setPost(data);
            } catch (error) {
                console.error("Error fetching post:", error);
                toast.error("Failed to load post");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Post not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer transition-colors mb-8"
            >
                <ArrowLeft size={20} />
                <span>Back to events</span>
            </button>

            {/* Main Content */}
            <article className="flex flex-col lg:flex-row gap-12">
                {/* Image Section - Full width on mobile, fixed width on desktop */}
                <div className="lg:w-1/2">
                    <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 aspect-[4/3] flex items-center justify-center">
                        {post.image ? (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        ) : (
                            <p className="text-gray-500">No image available</p>
                        )}
                    </div>
                </div>

                {/* Text Content Section */}
                <div className="lg:w-1/2">
                    <header className="mb-8">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <span>
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white">{post.title}</h1>
                        <div className=" flex justify-between">
                            <p className="text flex gap-2 text-red-500">
                               <Calendar/> Event Date: {post.date}
                            </p>
                            <p className="text flex gap-2 text-red-500">
                              <MapPin/>  Event Location: {post.location}
                            </p>
                        </div>

                        <div className="prose prose-invert text-justify max-w-none">
                            <p className="text-lg leading-relaxed">{post.description}</p>
                        </div>
                    </header>
                </div>
            </article>
        </div>
    );
};

export default EventView;