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
      console.log("Inquiries:", res.data);
      setInquiries(res.data);
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
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
    <div>
      <h2>📩 Inquiries</h2>

      {loading ? (
        <p>Loading...</p>
      ) : inquiries.length === 0 ? (
        <p>No inquiries found</p>
      ) : (
        inquiries.map((i) => (
          <div key={i.id} style={card}>
            <p>
              <b>User:</b> {i.userEmail || "N/A"}
            </p>
            <p>{i.message}</p>

            <button onClick={() => remove(i.id)} style={btn}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const card = {
  background: "white",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const btn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
};

export default InquiriesAdmin;
