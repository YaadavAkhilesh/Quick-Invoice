// src/App.jsx
import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Home } from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import About from "./pages/About/About";
import Connect from "./pages/Connect/connect";
import Pricing from "./pages/Pricing/Pricing";
import Dashboard from "./pages/Dashboard/Dashboard";
import FrgPass from "./pages/frgpass/frgpass";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";

import ProtectedRoute from "./Components/ProtectedRoute";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import Loading from "./pages/Loading/Loading";

import { AdminAuthProvider } from "./contexts/AdminAuthContext";

import DesktopGuard from "./Components/DesktopGuard";

const App = () => {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <Router>
      <AdminAuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {loading ? (
          <Loading onLoadingComplete={handleLoadingComplete} />
        ) : (
          <Routes>
            {/* ---------- Unrestricted pages ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />

            {/* ---------- All other pages are device‑guarded ---------- */}
            <Route
              path="/Login"
              element={
                <DesktopGuard>
                  <Login />
                </DesktopGuard>
              }
            />
            <Route
              path="/Registration"
              element={
                <DesktopGuard>
                  <Registration />
                </DesktopGuard>
              }
            />
            <Route
              path="/Connect"
              element={
                <DesktopGuard>
                  <Connect />
                </DesktopGuard>
              }
            />
            <Route
              path="/Pricing"
              element={
                <DesktopGuard>
                  <Pricing />
                </DesktopGuard>
              }
            />
            <Route
              path="/Frgpass"
              element={
                <DesktopGuard>
                  <FrgPass />
                </DesktopGuard>
              }
            />

            {/* Dashboard – protected by auth + device guard */}
            <Route
              path="/Dashboard/:section?"
              element={
                <ProtectedRoute>
                  <DesktopGuard>
                    <Dashboard />
                  </DesktopGuard>
                </ProtectedRoute>
              }
            />

            {/* ---------- Admin routes ---------- */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route
              path="/admin/login"
              element={
                <DesktopGuard>
                  <AdminLogin />
                </DesktopGuard>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <DesktopGuard>
                    <AdminDashboard />
                  </DesktopGuard>
                </AdminProtectedRoute>
              }
            />

            {/* ---------- Fallback ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AdminAuthProvider>
    </Router>
  );
};

export default App;
