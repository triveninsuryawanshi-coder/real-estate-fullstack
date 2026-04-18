import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../service/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password ❌");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      alert("Login successful ✅");

      if (data.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid email or password ❌");
    }
  };

  return (
    <div className="container">
      <div className="box login-box">
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={() => navigate("/")}>
          ×
        </button>

        <h3 className="title">Login</h3>

        <input
          type="email"
          placeholder="Enter your email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN OPTIONS */}
        <div className="login-options">
          <label>
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>

          <span className="link" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button className="button" onClick={handleLogin}>
          Login
        </button>

        {/* SIGNUP */}
        <p className="login-footer">
          Don’t have an account?
          <span className="link" onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
