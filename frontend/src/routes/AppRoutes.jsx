import { Routes, Route } from "react-router-dom";

// PUBLIC PAGES
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

// USER DASHBOARD
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Properties from "../pages/Properties";
import PostProperty from "../pages/PostProperty";
import PropertyDetail from "../pages/PropertyDetails";
import Payment from "../pages/Payment";
import About from "../pages/About";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import FAQ from "../pages/FAQ";
// ADMIN
import AdminDashboard from "../pages/admin/AdminDashboard";
import PropertiesAdmin from "../pages/admin/PropertiesAdmin";
import UserAdmin from "../pages/admin/UserAdmin";
import InquiriesAdmin from "../pages/admin/InquiriesAdmin";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="properties" element={<Properties />} />
        <Route path="property/:id" element={<PropertyDetail />} />

        {/* ✅ FIXED PAYMENT ROUTE */}
        <Route path="payment" element={<Payment />} />

        <Route
          path="add-property"
          element={
            <ProtectedRoute allowedRoles={["SELLER", "AGENT"]}>
              <PostProperty />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/faq" element={<FAQ />} />
      {/* ADMIN */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<PropertiesAdmin />} />
        <Route path="properties" element={<PropertiesAdmin />} />
        <Route path="users" element={<UserAdmin />} />
        <Route path="inquiries" element={<InquiriesAdmin />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
