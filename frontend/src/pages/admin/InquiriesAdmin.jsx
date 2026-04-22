import React, { useEffect, useState, useMemo } from "react";
import API from "../../service/api";
import "./InquiriesAdmin.css";

function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [toast, setToast] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/admin/inquiries");
      setInquiries(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load inquiries";
      setError(errorMsg);
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/inquiries/${id}/status`, { status });
      showToast(`Inquiry marked as ${status.toLowerCase()}!`, "success");
      load();
    } catch (err) {
      showToast("Failed to update status", "error");
      console.error("Status update error:", err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      await API.delete(`/admin/inquiries/${id}`);
      showToast("Inquiry deleted successfully!", "success");
      load();
    } catch (err) {
      showToast("Failed to delete inquiry", "error");
      console.error("Delete error:", err);
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    let filtered = inquiries;

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((inq) => inq.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inq) =>
          inq.buyerName?.toLowerCase().includes(term) ||
          inq.buyerEmail?.toLowerCase().includes(term) ||
          inq.propertyTitle?.toLowerCase().includes(term) ||
          inq.buyerPhone?.includes(term)
      );
    }

    return filtered;
  }, [inquiries, statusFilter, searchTerm]);

  // Sort inquiries
  const sortedInquiries = useMemo(() => {
    const sorted = [...filteredInquiries].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredInquiries, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage);
  const paginatedInquiries = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedInquiries.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedInquiries, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const SortableHeader = ({ name, sortKey }) => (
    <th
      onClick={() => handleSort(sortKey)}
      className={`sortable ${
        sortConfig.key === sortKey ? `sorted-${sortConfig.direction}` : ""
      }`}
    >
      {name}
    </th>
  );

  return (
    <div className="inquiries-container">
      <div className="inquiries-header">
        <h2>Inquiries Management</h2>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="inquiries-controls">
        <input
          type="text"
          placeholder="Search by buyer name, email, phone, or property..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="filter-group">
          {["All", "NEW", "READ", "RESOLVED"].map((status) => (
            <button
              key={status}
              className={`status-badge ${statusFilter === status ? "active" : ""}`}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
              {status !== "All" &&
                inquiries.filter((inq) => inq.status === status).length > 0 && (
                  <span style={{ marginLeft: "6px" }}>
                    ({inquiries.filter((inq) => inq.status === status).length})
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="inquiries-table-wrapper">
          <div style={{ padding: "32px", textAlign: "center" }}>
            <div className="loading-skeleton" style={{ height: "300px" }}></div>
          </div>
        </div>
      ) : paginatedInquiries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No inquiries found</h3>
          <p>
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your filters or search term"
              : "No inquiries yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="inquiries-table-wrapper">
            <table className="inquiries-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <SortableHeader name="Property" sortKey="propertyTitle" />
                  <SortableHeader name="Buyer" sortKey="buyerName" />
                  <th>Email</th>
                  <th>Phone</th>
                  <SortableHeader name="Date" sortKey="createdAt" />
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inquiry) => (
                  <tr key={inquiry.enquiryId}>
                    <td>#{inquiry.enquiryId}</td>
                    <td title={inquiry.propertyTitle}>{inquiry.propertyTitle}</td>
                    <td>{inquiry.buyerName}</td>
                    <td title={inquiry.buyerEmail} className="message-preview">
                      {inquiry.buyerEmail}
                    </td>
                    <td>{inquiry.buyerPhone || "—"}</td>
                    <td title={new Date(inquiry.createdAt).toLocaleString()}>
                      {getRelativeTime(inquiry.createdAt)}
                    </td>
                    <td>
                      <span className={`status-badge-cell status-${inquiry.status.toLowerCase()}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {inquiry.status !== "READ" && (
                          <button
                            className="action-btn btn-read"
                            onClick={() => updateStatus(inquiry.enquiryId, "READ")}
                            title="Mark as read"
                          >
                            ✓ Read
                          </button>
                        )}
                        {inquiry.status !== "RESOLVED" && (
                          <button
                            className="action-btn btn-resolve"
                            onClick={() => updateStatus(inquiry.enquiryId, "RESOLVED")}
                            title="Mark as resolved"
                          >
                            ✓ Resolve
                          </button>
                        )}
                        <button
                          className="action-btn btn-delete"
                          onClick={() => remove(inquiry.enquiryId)}
                          title="Delete inquiry"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ← First
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="page-info">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last →
              </button>

              <span className="page-info">
                Page {currentPage} of {totalPages} ({sortedInquiries.length} total)
              </span>
            </div>
          )}
        </>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default InquiriesAdmin;
