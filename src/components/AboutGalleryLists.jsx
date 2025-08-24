import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { UserAuth } from "../../supabase/AuthContext";
import { supabase } from "../../supabase/supabase_client";


const AboutGalleryList = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPosition, setEditPosition] = useState("");
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

        if (error || !data?.new_id) throw new Error("Admin not found");

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
    if (adminId) fetchItems();
  }, [adminId]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("aboutGallery")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      toast.error("Failed to fetch items");
      console.error("Fetch error:", error);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditDescription(item.description);
    setEditPosition(item.position);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDescription("");
    setEditPosition("");
  };

  const handleUpdate = async (itemId) => {
    if (!editDescription.trim() || !editPosition) {
      return toast.warning("Description and position cannot be empty");
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("aboutGallery")
        .update({
          description: editDescription,
          position: editPosition,
        })
        .eq("id", itemId);

      if (error) throw error;

      toast.success("Item updated successfully");
      fetchItems();
      cancelEditing();
    } catch (error) {
      toast.error("Failed to update item");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("aboutGallery").delete().eq("id", itemId);

      if (error) throw error;

      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete item");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-[#212121]">
      <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
        About Gallery Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-red-600"
            >
              {/* Image */}
              <div className="h-72 overflow-hidden relative">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.description}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {editingId === item.id ? (
                  <>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 mb-3 bg-gray-700 border border-red-500 rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      value={editPosition}
                      onChange={(e) => setEditPosition(e.target.value)}
                      className="w-full px-3 py-2 mb-3 bg-gray-700 border border-red-500 rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 line-clamp-3 mb-2">
                      {item.description || "No description available"}
                    </p>
                    <span className="text-sm text-gray-400">Position: {item.position}</span>
                  </>
                )}

                {/* Actions */}
                <div className="flex justify-end items-center mt-3 gap-2">
                  {editingId === item.id ? (
                    <>
                      <button
                        onClick={cancelEditing}
                        className="p-2 bg-gray-600 rounded-full hover:bg-gray-500 transition"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleUpdate(item.id)}
                        disabled={isUpdating}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 text-gray-900 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 text-gray-900" />
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(item)}
                        className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition"
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-white" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-400">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutGalleryList;
