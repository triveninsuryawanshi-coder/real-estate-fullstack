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
    <div style={{ padding: "20px" }}>
      <h2>👤 User Management</h2>

      {/* 🔥 LOADING STATE */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table border="1" width="100%" cellPadding="10">
          <thead style={{ background: "#eee" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {/* 🔥 EMPTY STATE */}
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>

                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.userId, e.target.value)}
                    >
                      <option value="BUYER">BUYER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="AGENT">AGENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() => deleteUser(u.userId)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserAdmin;
