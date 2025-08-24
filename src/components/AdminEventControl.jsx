import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../supabase/supabase_client";

const AdminEventControl = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("current_event")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error && error.code !== "PGRST116")
      console.error("Fetch error:", error);
    setActiveEvent(data || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchActiveEvent();
  }, []);

  const startEvent = async () => {
    // First deactivate any current active event
    await supabase
      .from("current_event")
      .update({ is_active: false })
      .eq("is_active", true);

    const { error } = await supabase.from("current_event").insert([
      {
        eventTitle: eventTitle, // Changed from 'title' to 'eventTitle'
        eventDescription: eventDescription, // Changed from 'description' to 'eventDescription'
        is_active: true,
      },
    ]);

    if (error) {
      console.error("Detailed error:", error); // Add this for debugging
      toast.error("Failed to start event.");
    } else {
      toast.success("Event started!");
      setEventTitle("");
      setEventDescription("");
      fetchActiveEvent();
    }
  };

  const endEvent = async () => {
    const { error } = await supabase
      .from("current_event")
      .update({ is_active: false })
      .eq("is_active", true);

    if (error) {
      toast.error("Failed to stop event.");
    } else {
      toast.success("Event ended.");
      setActiveEvent(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-800 text-gray-200 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-red-500 text-center">
        Event Control
      </h1>
      {loading ? (
        <div className="p-6 max-w-7xl flex justify-center items-center mx-auto bg-gray-800 text-gray-200 rounded-lg shadow-xl">
          <p className="text-3xl">Loading Data.....</p>
        </div>
      ) : (
        <>
          {activeEvent ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 capitalize">
                On going Event
              </h2>
              <p className="flex text-lg">
                <strong>
                  Title: 
                </strong> <p className="text-red-500"> {activeEvent.eventTitle}</p>
              </p>
              <p>
                <strong>Description:</strong> {activeEvent.eventDescription}
              </p>
            </div>
          ) : (
            <p className="mb-4 text-3xl text-center text-red-500">No active event.</p>
          )}
        </>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <textarea
          placeholder="Event Description"
          className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />

        <div className="flex flex-col md:flex-row mx-auto justify-center gap-4">
          <button
            onClick={startEvent}
            className="w-full md:w-[40%] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-red-600/50 cursor-pointer transition-transform transform hover:scale-105 duration-200"
          >
            Start Event
          </button>

          
          <button
            onClick={endEvent}
            className="w-full md:w-[40%] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-red-500/50 cursor-pointer transition-transform transform hover:scale-105 duration-200"
          >
            End Current Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventControl;
