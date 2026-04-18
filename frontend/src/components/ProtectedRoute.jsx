import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // ❌ Role not allowed
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;
