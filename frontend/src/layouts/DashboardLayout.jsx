import { Outlet, useNavigate, useLocation } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const location = useLocation();
  const isAddPropertyPage = location.pathname.includes("add-property");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      {/* 🔷 NAVBAR */}
      <div style={styles.navbar}>
        <h3
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          MyProperty
        </h3>
        <div style={styles.right}>
          {(role === "SELLER" || role === "AGENT") && (
            <button
              style={styles.addBtn}
              onClick={() => navigate("/dashboard/add-property?view=form")}
            >
              + Add Property
            </button>
          )}
          {isAddPropertyPage && (
            <button
              style={styles.Btn}
              onClick={() => navigate("/dashboard/add-property?view=list")}
            >
              My Properties
            </button>
          )}
          <button onClick={handleLogout} style={styles.Btn}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔷 PAGE CONTENT */}
      <div style={{ marginTop: "60px" }}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "60px",
    background: "#222",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    zIndex: 1000,
  },
  right: {
    display: "flex",
    gap: "10px",
  },
  addBtn: {
    background: "#fc060e",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  Btn: {
    background: "#fc060e",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DashboardLayout;
