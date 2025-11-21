// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import headlogo from "../assets/headerlogo.svg";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Send OTP (only if mobile matches registered one)
  const sendOtp = () => {
    const registeredMobile = localStorage.getItem("registeredMobile");
    const registeredOtp = localStorage.getItem("registeredOtp");

    if (!mobile) {
      setError("Please enter mobile number!");
      return;
    }
    if (mobile !== registeredMobile) {
      setError("Mobile number not registered!");
      return;
    }

    // OTP already saved from signup
    setOtpSent(true);
    setError("");
  };

  // Final Login
  // Final Login
const handleLogin = () => {
  const registeredMobile = localStorage.getItem("registeredMobile");
  const registeredOtp = localStorage.getItem("registeredOtp");

  if (mobile === registeredMobile && otp === registeredOtp) {
    if (remember) {
      localStorage.setItem("role", "user");
      localStorage.setItem("mobile", mobile);  // ✅ FIX: mobile bhi save kar
    } else {
      sessionStorage.setItem("role", "user");
      sessionStorage.setItem("mobile", mobile);  // ✅ FIX: mobile bhi save kar
    }
    navigate("/home");  // ✅ FIX: yahan se /home bhejna
  } else {
    setError("Invalid mobile number or OTP!");
  }
};


  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <img src={headlogo} alt="" className="mb-3" />

        <div className="text-center mb-3">
          <h5>Hi, Welcome Back!</h5>
          <p className="text-muted">Login to your account</p>
        </div>

        {/* Google Button (inactive for now) */}
        <button className="btn btn-outline-dark w-100 mb-3">
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="google"
            className="me-2"
          />
          Sign in with Google
        </button>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted">or Sign in with Mobile</span>
          <hr className="flex-grow-1" />
        </div>

        {/* Mobile + OTP */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button className="btn btn-outline-success" onClick={sendOtp}>
            Send OTP
          </button>
        </div>

        {otpSent && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        {/* Checkbox */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label className="form-check-label">Remember me</label>
        </div>

        {/* Error */}
        {error && <p className="text-danger">{error}</p>}

        {/* Log In Button */}
        <button className="btn btn-success w-100 mb-3" onClick={handleLogin}>
          Log In
        </button>

        <p className="text-center">
          Not registered yet? <Link to="/signup">Create an Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
