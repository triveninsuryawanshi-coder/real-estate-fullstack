import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../service/api";
import "../styles/Payment.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const property = location.state;

  const [paymentType, setPaymentType] = useState("deposit");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [authInput, setAuthInput] = useState("");
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);

  const [status, setStatus] = useState("PENDING");
  const [transactionId, setTransactionId] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  if (!property) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No property selected</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const depositAmount = property?.price ? property.price * 2 : 50000;
  const rentAmount = property?.price ? property.price : 5000;

  const amount = paymentType === "deposit" ? depositAmount : rentAmount;

  const generateTxnId = () => "TXN" + Math.floor(Math.random() * 1000000);

  // ================= OTP SEND =================
  const sendOtp = () => {
    if (!authInput) {
      setError("Enter required details!");
      return;
    }

    setError("");

    const newOtp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(newOtp.toString());
    setShowOtpBox(true);

    alert("Your OTP is: " + newOtp);
  };

  // ================= OTP VERIFY =================
  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) {
      setError("Invalid OTP!");
      return;
    }

    setError("");
    setShowOtpBox(false);
    handleFinalPayment();
  };

  // ================= FINAL PAYMENT =================
  const handleFinalPayment = async () => {
    const txn = generateTxnId();
    setTransactionId(txn);

    let finalStatus = "FAILED";

    if (paymentMethod === "card") {
      if (/^[0-9]{3}$/.test(authInput)) finalStatus = "COMPLETED";
    }

    if (paymentMethod === "upi") {
      if (/^[0-9]{4,6}$/.test(authInput)) finalStatus = "COMPLETED";
    }

    if (paymentMethod === "netbanking") {
      if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&*!]).{8,}$/.test(authInput)) {
        finalStatus = "COMPLETED";
      }
    }

    setStatus(finalStatus);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User not found. Please login again.");
        return;
      }

      // 🔥 CALL BACKEND ONLY IF SUCCESS
      if (finalStatus === "COMPLETED") {
        await API.post("/transactions/pay", null, {
          params: {
            userId: user.id,
            propertyId: property.propertyId,
            amount: amount,
          },
        });
      }

      setShowPopup(true);
    } catch (err) {
      console.error("Payment error:", err);
      alert("Backend payment failed");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>Property Payment</h2>

        <div className="property-details">
          <p>
            <strong>Property:</strong> {property.title}
          </p>
          <p>
            <strong>City:</strong> {property.city}
          </p>
        </div>

        {/* PAYMENT TYPE */}
        <div className="payment-type">
          <label>
            <input
              type="radio"
              value="deposit"
              checked={paymentType === "deposit"}
              onChange={(e) => setPaymentType(e.target.value)}
            />
            Security Deposit (₹{depositAmount})
          </label>

          <label>
            <input
              type="radio"
              value="rent"
              checked={paymentType === "rent"}
              onChange={(e) => setPaymentType(e.target.value)}
            />
            Monthly Rent (₹{rentAmount})
          </label>
        </div>

        <h3>Amount: ₹{amount}</h3>

        {/* PAYMENT METHOD */}
        <div className="payment-method">
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>

          <label>
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              value="netbanking"
              checked={paymentMethod === "netbanking"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Net Banking
          </label>
        </div>

        {/* INPUT */}
        <div className="payment-form">
          <input
            type="password"
            placeholder="Enter details"
            onChange={(e) => setAuthInput(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="pay-btn" onClick={sendOtp}>
          Send OTP
        </button>

        {/* OTP BOX */}
        {showOtpBox && (
          <div className="otp-box">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify & Pay</button>
          </div>
        )}

        {/* POPUP */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h2>Payment {status}</h2>
              <p>
                <strong>Transaction ID:</strong> {transactionId}
              </p>

              <button onClick={() => navigate("/payment-history")}>
                View Payment History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
