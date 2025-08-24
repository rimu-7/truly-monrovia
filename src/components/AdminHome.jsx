import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase_client";
import { UserAuth } from "../../supabase/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

const Home = () => {
  const { session, logOutUser } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (!session) {
        navigate("/login");

        return toast.error("Only admin can see this");
      }
      if (session) {
        const { data, error } = await supabase
          .from("admin")
          .select("email, name")
          .eq("email", session.user.email)
          .single();
        if (error) {
          console.error("Error fetching admin info:", error);
        } else {
          setAdminInfo(data);
        }
        setLoading(false);
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
    <div className="max-w-7xl min-h-screen flex justify-center items-center flex-col mx-auto text-center bg-[#212121]">
      <div className="w-full h-full p-10 border-gray-900">
        <h1 className="text-4xl font-extrabold text-red-500 mb-4">
          👋 Welcome, Admin!
        </h1>
        {adminInfo && (
          <p className="mb-6 text-gray-300 text-lg">
            Signed in as{" "}
            <span className="text-red-500 font-semibold">
              {adminInfo.name}
            </span>
          </p>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-center cursor-pointer hover:bg-red-600 duration-300 border-red-500 border-2 hover:border-[#212121] text-2xl text-white font-semibold py-4 px-10 rounded-full"
        >
          <div className="flex justify-center items-center gap-2">
            <p>Logout</p> <LogOut />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
