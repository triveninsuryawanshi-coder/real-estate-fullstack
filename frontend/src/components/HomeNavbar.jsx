import "./HomeNavbar.css";
import { useNavigate } from "react-router-dom";

function HomeNavbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        MyProperty
      </h3>

      <div>
        <button onClick={() => navigate("/login")}>Login</button>

        <button
          onClick={() => navigate("/register")}
          style={{ marginLeft: "10px" }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default HomeNavbar;
