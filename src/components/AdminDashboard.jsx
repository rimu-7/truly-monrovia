import React, { useState } from "react";

// Components
import SubmitBSeen_Data from "./SbmitBSeen_Data";
import Home from "./AdminHome";
import EventPost from "./Event/EventPost";
import HeroBg from "./HeroBg";
import TMPost from "./TM-Magazine/TMPost";
import FeaturePost from "./Feature/FeaturePost";
import ExplorepostByAdmin from "./Explore/ExplorepostByAdmin";
import Library from "./Library";
import CategoryBG from "./CategoryBG";
import BlogUpload from "./TM-Magazine/BlogUpload";

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const panelConfig = [
    {
      key: "Home",
      label: "Home",
      content: () => <Home />,
    },
    {
      key: "Submit&BSeen",
      label: "Submit&BSeen",
      content: () => <SubmitBSeen_Data />,
    },
    {
      key: "FeaturePost",
      label: "FeaturePost",
      content: () => <FeaturePost />,
    },
    {
      key: "ExplorepostByAdmin",
      label: "ExplorepostByAdmin",
      content: () => <ExplorepostByAdmin />,
    },
    {
      key: "TM Magazine",
      label: "TM Magazine",
      content: () => <TMPost />,
    },
    {
      key: "TM Blog Upload",
      label: "TM Blog Upload",
      content: () => <BlogUpload />,
    },
    {
      key: "EventPost",
      label: "EventPost",
      content: () => <EventPost />,
    },
    {
      key: "Library",
      label: "Library",
      content: () => <Library />,
    },
    {
      key: "Hero BG",
      label: "Hero BG",
      content: () => <HeroBg />,
    },
    {
      key: "CategoryBG",
      label: "CategoryBG",
      content: () => <CategoryBG />,
    },
  ];

  const getButtonClass = (key) =>
    `py-2 px-4 rounded flex flex-col w-full mb-2 cursor-pointer ${
      activePanel === key
        ? "bg-[#FFD700] hover:bg-[#ffc800] text-black"
        : "bg-gray-700 hover:bg-gray-600 text-white"
    }`;

  const currentPanel = panelConfig.find((panel) => panel.key === activePanel);

  return (
    <div className="min-h-screen bg-[#212121] text-white flex flex-col lg:flex-row">
      {/* Topbar with toggle button */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3 bg-[#333333] border-b border-gray-700">
        <h2 className=" font-semibold ">Admin Panel</h2>
        <span className="text-[#FFD700]">{activePanel}</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white cursor-pointer focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block " : "hidden"
        } lg:block w-full lg:w-64 bg-[#333333] py-36  border-b lg:border-b-0 lg:border-r border-gray-700 p-4 flex flex-col gap-4 z-10`}
      >
        <div className="text-center text-xl font-semibold lg:mb-4">
          <span className="hidden py-2 px-4 rounded bg-green-500 text-black border-yellow-300 border-2 flex-col w-full mb-2 lg:block">
            Admin Panel
          </span>
        </div>
        {panelConfig.map((panel) => (
          <button
            key={panel.key}
            onClick={() => {
              setActivePanel(panel.key);
              setSidebarOpen(false);
            }}
            className={getButtonClass(panel.key)}
          >
            {panel.label}
          </button>
        ))}
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-4 sm:p-6">{currentPanel?.content()}</main>
    </div>
  );
};

export default AdminDashboard;
