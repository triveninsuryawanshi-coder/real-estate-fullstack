import React, { useEffect, useState } from "react";
import API from "../../service/api";


function PropertiesAdmin() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const res = await API.get("/admin/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/properties/${id}/status`, { status });
      loadProperties();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete property?")) return;
    try {
      await API.delete(`/properties/${id}`);
      loadProperties();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={styles.adminContainer}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Property Management</h2>

        {loading ? (
          <div style={styles.loader}>Loading...</div>
        ) : properties.length === 0 ? (
          <div style={styles.empty}>No properties found</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.propertyId}>
                    <td>{p.propertyId}</td>
                    <td>{p.title}</td>
                    <td>{p.city}</td>
                    <td>₹ {p.price}</td>
                    <td>
                      <span style={statusStyle(p.status)}>{p.status}</span>
                    </td>
                    <td>
                      <div style={styles.actions}>
                        <button
                          style={{ ...styles.approve, ...styles.actionButton }}
                          onClick={() => updateStatus(p.propertyId, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          style={{ ...styles.reject, ...styles.actionButton }}
                          onClick={() => updateStatus(p.propertyId, "REJECTED")}
                        >
                          Reject
                        </button>
                        <button
                          style={{ ...styles.delete, ...styles.actionButton }}
                          onClick={() => deleteProperty(p.propertyId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesAdmin;


const styles = {
  adminContainer: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  heading: {
    marginBottom: "28px",
    color: "#22223b",
    fontWeight: 700,
    fontSize: "2rem",
    letterSpacing: "-1px",
    textAlign: "center",
  },
  loader: {
    textAlign: "center",
    color: "#888",
    fontSize: "1.1rem",
    padding: "32px 0",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    fontSize: "1.1rem",
    padding: "32px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    marginBottom: "0",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    alignItems: "center",
    minWidth: "320px",
    justifyContent: "center",
  },
  actionButton: {
    flex: 1,
    minWidth: 0,
    maxWidth: "110px",
    whiteSpace: "nowrap",
  },
  approve: {
    background: "#6ee7b7", // light green
    color: "#065f46",
    border: "none",
    padding: "7px 18px",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
    marginBottom: "2px",
  },
  reject: {
    background: "#fde68a", // light amber
    color: "#92400e",
    border: "none",
    padding: "7px 18px",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
    marginBottom: "2px",
  },
  delete: {
    background: "#fecaca", // light red
    color: "#991b1b",
    border: "none",
    padding: "7px 18px",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

const statusStyle = (status) => ({
  padding: "4px 12px",
  borderRadius: "12px",
  color: "#fff",
  fontWeight: 600,
  fontSize: "13px",
  background:
    status === "APPROVED"
      ? "#22c55e"
      : status === "REJECTED"
      ? "#ef4444"
      : status === "SOLD"
      ? "#2563eb"
      : "#f59e0b",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  letterSpacing: "0.5px",
});
