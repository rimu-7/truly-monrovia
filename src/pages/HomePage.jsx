// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight, Loader2 } from "lucide-react";
// import { supabase } from "../../supabase/supabase_client";

// const HomePage = () => {
//   const [activeEvent, setActiveEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchActiveEvent = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("current_event")
//       .select("*")
//       .eq("is_active", true)
//       .single();

//     if (error && error.code !== "PGRST116") {
//       console.error("Fetch error:", error);
//     }
//     setActiveEvent(data || null);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchActiveEvent();
//   }, []);

//   return (
//     <div className="min-h-screen px-4 py-12 flex justify-center items-center text-white">
//       <div className="max-w-7xl w-full mx-auto backdrop-blur-md bg-gray-800 border border-[#FFD700] rounded-2xl shadow-2xl p-10 transition-all duration-300">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-lg">
//           Welcome to Truly Monrovia
//         </h1>

//         {loading ? (
//           <div className="flex justify-center items-center gap-3 text-lg">
//             <Loader2 className="animate-spin text-yellow-400" size={28} />
//             <span className="animate-pulse">Loading event data...</span>
//           </div>
//         ) : activeEvent ? (
//           <div className="space-y-4 text-center">
//             <h2 className="text-2xl font-semibold text-yellow-400 uppercase tracking-wide">
//               Ongoing Event
//             </h2>
//             <p>
//               <strong className="text-gray-300">Title:</strong>{" "}
//               <span className="text-yellow-300 font-medium text-lg">
//                 {activeEvent.eventTitle}
//               </span>
//             </p>
//             <p>
//               <strong className="text-gray-300">Description:</strong>{" "}
//               <span className="text-gray-200">
//                 {activeEvent.eventDescription}
//               </span>
//             </p>
//           </div>
//         ) : (
//           <p className="text-red-400 text-center text-xl animate-pulse">
//             Currently, there are no events scheduled. Please check back soon for
//             updates!
//           </p>
//         )}

//         <div className="mt-12 text-center">
//           <button
//             onClick={() => navigate("/event-form")}
//             className="bg-gradient-to-r cursor-pointer from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-500/50 transition-transform transform hover:scale-105 duration-200"
//           >
//             <div className="flex justify-center items-center">
//               <p>Go to Event Page</p> <ArrowRight size={25} className="" />
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-7xl flex justify-center items-center  w-full mx-auto backdrop-blur-md bg-gray-800 border border-[#FFD700] rounded-2xl shadow-2xl p-10 transition-all duration-300">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 drop-shadow-lg">
          Welcome to Truly Monrovia
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
