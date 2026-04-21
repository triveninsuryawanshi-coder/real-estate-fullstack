import React, { useEffect, useState } from "react";
import API from "../../service/api";

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      console.log("Users:", res.data); // DEBUG
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      console.error("Role update error:", err);
    }
  };

    return (
      <div style={styles.adminContainer}>
        <div style={styles.card}>
          <h3 style={styles.heading}>👤 User Management</h3>
          {loading ? (
            <div style={styles.loader}>Loading users...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={{...styles.th, ...styles.emailTh}}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={styles.empty}>No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.userId}>
                        <td style={styles.td}>{u.userId}</td>
                        <td style={styles.td}>{u.fullName}</td>
                        <td style={{...styles.td, ...styles.emailTd}}>{u.email}</td>
                        <td style={styles.td}>
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.userId, e.target.value)}
                            style={styles.select}
                          >
                            <option value="BUYER">BUYER</option>
                            <option value="SELLER">SELLER</option>
                            <option value="AGENT">AGENT</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => deleteUser(u.userId)}
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
}


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
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    marginBottom: "28px",
    color: "#2563eb", // blue-600
     fontWeight: 700,
     fontSize: "1.7rem",
    letterSpacing: "-1px",
    textAlign: "center",
    textShadow: "0 2px 8px rgba(37,99,235,0.08)",
  },
  emailTh: {
    minWidth: "260px",
    width: "30%",
  },
  emailTd: {
    minWidth: "260px",
    width: "30%",
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
    tableLayout: "fixed",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#f3f4f6",
    color: "#374151",
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #e5e7eb",
  },
  td: {
    textAlign: "left",
    padding: "12px 16px",
    color: "#22223b",
    fontSize: "1rem",
    borderBottom: "1px solid #f1f1f1",
    verticalAlign: "middle",
    wordBreak: "break-word",
  },
  select: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    background: "#f3f4f6",
    fontWeight: 500,
    fontSize: "1rem",
    color: "#22223b",
    outline: "none",
    transition: "border 0.2s",
  },
  deleteBtn: {
    background: "#fecaca",
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

export default UserAdmin;
