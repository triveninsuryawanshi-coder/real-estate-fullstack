import { useState } from "react";
import API from "../service/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!email || !newPassword) {
      alert("Please fill all fields ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }
    try {
      const response = await API.post("/auth/forgot-password", {
        email,
        newPassword,
      });

      alert(response.data.message || "Password updated ✅");

      // 👉 Go back to login
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed ❌");
    }
  };
  return (
    <div className="container">
      <div className="box forgot-box">
        <button className="close-btn" onClick={() => navigate("/login")}>
          ×
        </button>
        <br />
        <h3>Reset Password</h3>
        <br />

        <input
          type="email"
          placeholder="Enter your email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          className="input"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          className="input"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="show-pass">
          <label>
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
        <button className="button" onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
