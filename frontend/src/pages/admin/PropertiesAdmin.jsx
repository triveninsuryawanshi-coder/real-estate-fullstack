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
      console.log("Properties:", res.data);
      setProperties(res.data);
    } catch (err) {
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    console.log("Clicked:", id, status); // debug

    try {
      await API.put(`/admin/properties/${id}/status`, { status });
      loadProperties();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete property?")) return;

    try {
      await API.delete(`/admin/properties/${id}`);
      loadProperties();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏠 Property Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <table border="1" cellPadding="12" style={{ width: "100%" }}>
          <thead style={{ background: "#f3f4f6" }}>
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

                {/* 🔥 FIXED BUTTON SPACING */}
                <td>
                  <div style={styles.actions}>
                    <button
                      style={styles.approve}
                      onClick={() => updateStatus(p.propertyId, "APPROVED")}
                    >
                      Approve
                    </button>

                    <button
                      style={styles.reject}
                      onClick={() => updateStatus(p.propertyId, "REJECTED")}
                    >
                      Reject
                    </button>

                    <button
                      style={styles.delete}
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
      )}
    </div>
  );
}

export default PropertiesAdmin;

/* 🎨 CLEAN SIMPLE STYLES */

const styles = {
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  approve: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },

  reject: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },
};

/* STATUS COLOR */

const statusStyle = (status) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  color: "white",
  fontSize: "12px",
  background:
    status === "AVAILABLE" ? "green" : status === "SOLD" ? "blue" : "orange",
});
