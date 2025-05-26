import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import AdminEventControl from "./AdminEventControl";
import { UserAuth } from "../../supabase/AuthContext";
import { supabase } from "../../supabase/supabase_client";
import SubmitBSeen_Data from "./SbmitBSeen_Data";

const AdminDashboard = () => {
  const { session, logOutUser } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("admin_info_only")
          .select("email, name")
          .eq("email", session.user.email) // Assuming email is used to identify the admin
          .single(); // Use .single() if you expect only one record

        if (error) {
          console.error("Error fetching admin info:", error);
        } else {
          setAdminInfo(data);
        }
        setLoading(false);
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    };

    fetchAdminInfo();
  }, [session, navigate]);

  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8 ">
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-6">
          Welcome, Admin!
        </h1>

        <p>
          {adminInfo && (
            <div>
              <p className="mb-6 text-gray-300">
                You are signed in as <span>{adminInfo.name}</span>
                <span className="text-[#FFD700]"> {adminInfo.email}</span>
              </p>
            </div>
          )}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
        
      </div>
      {/* <AdminEventControl /> */}
      <SubmitBSeen_Data />
    </div>
  );
};

export default AdminDashboard;
