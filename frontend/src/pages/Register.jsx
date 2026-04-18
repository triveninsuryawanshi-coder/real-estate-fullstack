import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();

  // ✅ STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ REGISTER FUNCTION
  const handleRegister = async () => {
    // 🔴 VALIDATIONS
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields ❌");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    if (!formData.role) {
      alert("Please select a role ❌");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Registered successfully ✅");

        // ✅ CLEAR FORM
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          phone: "",
        });

        // ✅ REDIRECT
        navigate("/login");
      } else {
        alert(data.message || "Registration failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="box register-box">
        <button className="close-btn" onClick={() => navigate("/")}>
          ×
        </button>

        <h3 className="title">Sign Up</h3>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          className="input"
          value={formData.name}
          onChange={handleChange}
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="input"
          value={formData.email}
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          className="input"
          value={formData.password}
          onChange={handleChange}
        />

        {/* CONFIRM PASSWORD */}
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm password"
          className="input"
          value={formData.confirmPassword}
          onChange={handleChange}
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

        {/* ROLE */}
        <select
          name="role"
          className="input"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
          <option value="AGENT">Agent</option>
        </select>
        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          className="input"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* BUTTON */}
        <button className="button" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="register-footer">
          Already have an account?
          <span
            className="link"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", marginLeft: "5px" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
