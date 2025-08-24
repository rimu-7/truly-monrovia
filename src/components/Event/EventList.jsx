import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../../supabase/AuthContext";
import { supabase } from "../../../supabase/supabase_client";

const EventList = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
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
        .from("event-posts")
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
    setEditData({
      title: post.title || "",
      description: post.description || "",
      date: post.date || "",
      location: post.location || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({
      title: "",
      description: "",
      date: "",
      location: "",
    });
  };

  const handleUpdate = async (postId) => {
    if (!editData.title.trim() || !editData.description.trim()) {
      return toast.warning("Title and description cannot be empty");
    }

    setIsUpdating(true);

    try {
      const { data, error } = await supabase
        .from("event-posts")
        .update({
          title: editData.title,
          description: editData.description,
          date: editData.date,
          location: editData.location,
          created_at: new Date().toISOString(),
        })
        .eq("id", postId)
        .select();

      if (error) throw error;

      toast.success("Event updated successfully");
      fetchPosts();
      cancelEditing();
    } catch (error) {
      toast.error(`Failed to update event: ${error.message}`);
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("event-posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast.success("Event deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-lg text-gray-300">Loading admin access...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-[#212121]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-8 text-center">
          Manage Events
        </h1>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all hover:border-red-500"
              >
                {/* Image and Basic Info */}
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-5 md:w-2/3">
                    {editingId === post.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-bold"
                          placeholder="Event Title"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
                            <Calendar className="h-5 w-5 text-red-500" />
                            <input
                              type="datetime-local"
                              value={editData.date}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  date: e.target.value,
                                })
                              }
                              className="bg-transparent w-full focus:outline-none text-gray-200"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg">
                            <MapPin className="h-5 w-5 text-red-500" />
                            <input
                              type="text"
                              value={editData.location}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  location: e.target.value,
                                })
                              }
                              className="bg-transparent w-full focus:outline-none text-gray-200"
                              placeholder="Location"
                            />
                          </div>
                        </div>

                        <textarea
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Event description..."
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-red-500">
                          {post.title}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          {post.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-red-500" />
                              <span>
                                {new Date(post.date).toLocaleString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          )}
                          {post.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>{post.location}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-300">
                          {post.description || "No description available"}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                      <span className="text-xs text-gray-400">
                        Created:{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                        {post.updated_at && (
                          <span className="ml-2">
                            (Updated:{" "}
                            {new Date(post.updated_at).toLocaleDateString()})
                          </span>
                        )}
                      </span>
                      {/* comment out for show edit and delete button */}
                      <div className="flex gap-2">
                        {editingId === post.id ? (
                          <>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-1 bg-gray-600 rounded-lg hover:bg-gray-500 transition flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={() => handleUpdate(post.id)}
                              disabled={isUpdating}
                              className="px-3 py-1 bg-red-500 text-gray-900 rounded-lg hover:bg-red-600 transition flex items-center gap-1 disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                              <span>Save</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(post)}
                              className="px-3 py-1 bg-blue-600 rounded-lg hover:bg-blue-500 transition flex items-center gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              disabled={isDeleting}
                              className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500 transition flex items-center gap-1 disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
