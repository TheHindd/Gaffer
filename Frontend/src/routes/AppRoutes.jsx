import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "../components/Common/Loader";

// Lazy-loaded pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const MyProjects = lazy(() => import("../pages/MyProjects"));
const ChatsPage = lazy(() => import("../pages/ChatsPage"));

export default function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/projects/:projectId" element={<ProjectsPage />} />
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/chats" element={<ChatsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
