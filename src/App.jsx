import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import Navbar from "./Shared/Navbar";
import Footer from "./Shared/Footer";
import SubmitBSeen from "./event-form/SubmitBSeen";
import PostView from "./pages/PostView";
import Events from "./pages/Events";
import EventView from "./pages/EventView";

const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));
const ResendConfirmation = lazy(() => import("./pages/ResendConfirmation"));
const Feature = lazy(() => import("./pages/Feature"));
const Explore = lazy(() => import("./pages/Explore"));
const ExploreView = lazy(() => import("./pages/ExploreView"));
const ErrorPage = lazy(() => import("./Shared/ErrorPage"));

const App = () => {
  return (
    <div className="bg-[#212121] text-white min-h-screen">
      <Router>
        <Navbar />
        <Suspense
          fallback={
            <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-[#212121]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
              <p className="text-lg">Loading.....</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route
              path="/resend-confirmation"
              element={<ResendConfirmation />}
            />
            <Route path="/submitbseen" element={<SubmitBSeen />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/features" element={<Feature />} />
            <Route path="/postview/:id" element={<PostView />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explores/:id" element={<ExploreView />} />

            <Route path="/eventview/:id" element={<EventView />} />
            <Route path="/events" element={<Events />} />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
        <Footer />
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          transition={Zoom}
        />
      </Router>
    </div>
  );
};

export default App;
