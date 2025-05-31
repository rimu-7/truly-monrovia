import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../supabase/AuthContext";
import { supabase } from "../../supabase/supabase_client";

const ExplorePostsList = () => {
    const { session } = UserAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [adminId, setAdminId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchAdminId = async () => {
            if (!session) {
                navigate("/login");
                return toast.error("Only admin can access this");
            }

            try {
                const { data, error } = await supabase
                    .from("admin")
                    .select("new_id")
                    .eq("email", session.user.email)
                    .single();

                if (error || !data?.new_id) {
                    throw new Error("Admin not found");
                }

                setAdminId(data.new_id);
            } catch (error) {
                toast.error("Failed to verify admin access");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminId();
    }, [session, navigate]);

    useEffect(() => {
        if (adminId) {
            fetchPosts();
        }
    }, [adminId]);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("explore-posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            setPosts(data || []);
        } catch (error) {
            toast.error("Failed to fetch posts");
            console.error("Fetch error:", error);
        }
    };

    const startEditing = (post) => {
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditDescription(post.description);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
    };

    const handleUpdate = async (postId) => {
        if (!editTitle.trim() || !editDescription.trim()) {
            return toast.warning("Title and description cannot be empty");
        }

        setIsUpdating(true);

        try {
            const { error } = await supabase
                .from("explore-posts")
                .update({
                    title: editTitle,
                    description: editDescription,
                    created_at: new Date().toISOString(),
                })
                .eq("id", postId);

            if (error) throw error;

            toast.success("Post updated successfully");
            fetchPosts();
            cancelEditing();
        } catch (error) {
            toast.error("Failed to update post");
            console.error("Update error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);

        try {
            const { error } = await supabase
                .from("explore-posts")
                .delete()
                .eq("id", postId);

            if (error) throw error;

            toast.success("Post deleted successfully");
            fetchPosts();
        } catch (error) {
            toast.error("Failed to delete post");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
                <p className="text-lg text-gray-300">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-[#212121]">
            <h1 className="text-4xl font-extrabold text-[#FFD700] mb-8 text-center">
                Explore Posts Management
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-yellow-300"
                        >
                            {/* Images */}
                            <div className="h-48 overflow-hidden relative">
                                {post.image1 && (
                                    <img
                                        src={post.image1}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute top-2 left-2 bg-[#FFD700] text-gray-900 px-2 py-1 rounded-md text-sm font-bold">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {editingId === post.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full px-3 py-2 mb-2 bg-gray-700  rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                                        />
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 mb-3 bg-gray-700 rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-300 line-clamp-3">
                                            {(post.description || "No description available").length > 70
                                                ? (post.description || "No description available").substring(0, 70) + "..."
                                                : (post.description || "No description available")}
                                        </p>
                                    </>
                                )}

                                {/* Actions */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>

                                    {editingId === post.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={cancelEditing}
                                                className="p-2 bg-gray-600 rounded-full hover:bg-gray-500 transition"
                                            >
                                                <X className="h-4 w-4 text-white" />
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(post.id)}
                                                disabled={isUpdating}
                                                className="p-2 bg-[#FFD700] rounded-full hover:bg-[#e6c200] transition disabled:opacity-50"
                                            >
                                                {isUpdating ? (
                                                    <Loader2 className="h-4 w-4 text-gray-900 animate-spin" />
                                                ) : (
                                                    <Check className="h-4 w-4 text-gray-900" />
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditing(post)}
                                                className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition"
                                            >
                                                <Edit className="h-4 w-4 text-white" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={isDeleting}
                                                className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition disabled:opacity-50"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 text-white" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-xl text-gray-400">No posts found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePostsList;