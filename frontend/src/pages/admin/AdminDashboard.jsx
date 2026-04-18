import React from "react";
import { Link, Navigate, useLocation, Outlet } from "react-router-dom";

function AdminDashboard() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  if (!role) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🏢 Admin Panel</h2>

        <Link
          to="properties"
          style={{
            ...styles.link,
            background: location.pathname.includes("properties")
              ? "#1f2937"
              : "",
          }}
        >
          🏠 Properties
        </Link>

        <Link
          to="users"
          style={{
            ...styles.link,
            background: location.pathname.includes("users") ? "#1f2937" : "",
          }}
        >
          👤 Users
        </Link>

        <Link
          to="inquiries"
          style={{
            ...styles.link,
            background: location.pathname.includes("inquiries")
              ? "#1f2937"
              : "",
          }}
        >
          📩 Inquiries
        </Link>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#f3f4f6",
    fontFamily: "Arial",
  },
  sidebar: {
    width: "250px",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  logo: {
    marginBottom: "20px",
  },
  link: {
    padding: "12px",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
  main: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};
