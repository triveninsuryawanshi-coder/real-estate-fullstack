import React, { useEffect, useState } from "react";
import API from "../../service/api";

function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/admin/inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/inquiries/${id}/status`, { status });
      load();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete inquiry?")) return;

    try {
      await API.delete(`/admin/inquiries/${id}`);
      load();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Inquiries</h2>

      {loading ? (
        <p>Loading...</p>
      ) : inquiries.length === 0 ? (
        <p>No inquiries found</p>
      ) : (
        <table border="1" cellPadding="12" style={styles.table}>
          <thead style={styles.head}>
            <tr>
              <th>ID</th>
              <th>Property</th>
              <th>Buyer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Owner Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.enquiryId}>
                <td>{inquiry.enquiryId}</td>
                <td>{inquiry.propertyTitle}</td>
                <td>{inquiry.buyerName}</td>
                <td>{inquiry.buyerEmail}</td>
                <td>{inquiry.buyerPhone || "N/A"}</td>
                <td>{inquiry.ownerEmail}</td>
                <td>{inquiry.message}</td>
                <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
                <td>
                  <span style={statusStyle(inquiry.status)}>{inquiry.status}</span>
                </td>
                <td>
                  <div style={styles.actions}>
                    <button
                      style={styles.read}
                      onClick={() => updateStatus(inquiry.enquiryId, "READ")}
                    >
                      Mark Read
                    </button>
                    <button
                      style={styles.resolve}
                      onClick={() =>
                        updateStatus(inquiry.enquiryId, "RESOLVED")
                      }
                    >
                      Resolve
                    </button>
                    <button
                      style={styles.delete}
                      onClick={() => remove(inquiry.enquiryId)}
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

const styles = {
  container: {
    padding: "20px",
  },
  table: {
    width: "100%",
    background: "white",
  },
  head: {
    background: "#f3f4f6",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  read: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },
  resolve: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },
  delete: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },
};

const statusStyle = (status) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  color: "white",
  fontSize: "12px",
  background:
    status === "NEW" ? "#f59e0b" : status === "READ" ? "#2563eb" : "#16a34a",
});

export default InquiriesAdmin;
