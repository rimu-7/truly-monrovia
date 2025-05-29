import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserAuth } from "../../supabase/AuthContext";
import { supabase } from "../../supabase/supabase_client";

const SubmitBSeen_Data = () => {
  const { session } = UserAuth();
  const navigate = useNavigate();
  const [submission_data, setSubmission_data] = useState([]);
  const [loading, setLoading] = useState(true);

  const colorMap = {
    1: "bg-blue-800",
    2: "bg-green-800",
    3: "bg-purple-800",
    4: "bg-pink-800",
    5: "bg-red-800",
    6: "bg-indigo-800",
    7: "bg-teal-800",
    8: "bg-orange-800",
    9: "bg-yellow-800",
    10: "bg-gray-800",
    11: "bg-cyan-800",
    12: "bg-lime-800",
    13: "bg-emerald-800",
    14: "bg-rose-800",
    15: "bg-slate-800",
    16: "bg-violet-800",
    17: "bg-fuchsia-800",
    18: "bg-mint-800",
    19: "bg-amber-800",
    20: "bg-burgundy-800",
    21: "bg-blue-900",
    22: "bg-green-900",
    23: "bg-purple-900",
    24: "bg-pink-900",
    25: "bg-red-900",
    26: "bg-indigo-900",
    27: "bg-teal-900",
    28: "bg-orange-900",
    29: "bg-yellow-900",
    30: "bg-gray-900",
    31: "bg-cyan-900",
    32: "bg-lime-900",
    33: "bg-emerald-900",
    34: "bg-rose-900",
    35: "bg-slate-900",
    36: "bg-violet-900",
    37: "bg-fuchsia-900",
    38: "bg-mint-900",
    39: "bg-amber-900",
    40: "bg-burgundy-900",

    default: "bg-gray-800",
  };
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    const fetchsubmission_data = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("submitbseen")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Fetched data:", data); // Debug log
        setSubmission_data(data || []);
      } catch (error) {
        console.error("Error fetching data:", error); // Detailed error log
        toast.error(`Failed to load event data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchsubmission_data();
  }, [session, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  return (
    <div className="container px-2 bg-gray-800 mt-12 rounded mx-auto max-w-7xl py-8">
      <h1 className="text-3xl text-center font-bold text-[#FFD700] mb-8">
        Submit&BSeen Data
      </h1>

      {submission_data.length === 0 ? (
        <div className="text-center text-gray-300 py-8">No data available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-[#FFD700]">
              <tr>
                <th className="px-2 py-3 text-left">ID</th>
                <th className="px-2 py-3 text-left">Name</th>
                <th className="px-2 py-3 text-left">Contact</th>
                <th className="px-2 py-3 text-left">Category</th>
                <th className="px-2 py-3 text-left">Address</th>
                <th className="px-2 py-3 text-left">Creative Name</th>
                <th className="px-2 py-3 text-left">Social Media</th>
                <th className="px-2 py-3 text-left">Project Link</th>
                <th className="px-2 py-3 text-left">Profile Link</th>
                <th className="px-2 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {submission_data.map((event) => {
                const colorClass = colorMap[event.id] || colorMap.default;
                return (
                  <tr
                    key={event.id}
                    className={`${colorClass} hover:bg-[#212121] duration-300 transition-colors ease-in-out`}
                  >
                    <td className="px-2 py-4 ">{event.id}</td>
                    <td className="px-2 py-4 ">{event.name}</td>
                    <td className="px-2 py-4 ">{event.contact}</td>
                    <td className="px-2 py-4  capitalize">
                      {event.category}
                    </td>
                    <td className="px-2 py-4 ">{event.address}</td>
                    <td className="px-2 py-4 ">
                      {event.creative_name}
                    </td>
                    <td className="px-2 py-4 ">
                      {event.social_media}
                    </td>
                    <td className="px-2 py-4 ">
                      {event.link_to_project}
                    </td>
                    <td className="px-2 py-4 ">
                      {event.link_to_profile}
                    </td>
                    <td className="px-2 py-4 ">
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmitBSeen_Data;
