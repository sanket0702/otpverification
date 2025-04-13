import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import "./MobileOtpLogin.css";
import { sendOtp } from "./api"; // Your API function for sending OTP

export default function MobileOtpLogin() {
  const [step, setStep] = useState(1); // Set to 1 for real use
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpFromApi, setOtpFromApi] = useState("");
  const [verified, setVerified] = useState(false);
  const [shake, setShake] = useState(false);
  const inputs = useRef([]);

  // Focus first input when step changes to OTP input
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => inputs.current[0]?.focus(), 200);
    }
  }, [step]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "" && index > 0) {
        setTimeout(() => inputs.current[index - 1]?.focus(), 10);
        newOtp[index - 1] = "";
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      setTimeout(() => inputs.current[index + 1]?.focus(), 10);
    }
  };

  const handleMobileSubmit = async () => {
    if (mobile.length >= 10 && mobile.length <= 14) {
      try {
        const response = await sendOtp(`+91${mobile}`);
        setOtpFromApi(response.verify_code);
        setStep(2);
        console.log("📨 OTP Sent:", response.verify_code);
      } catch (error) {
        console.error(error);
        alert("❌ Failed to send OTP. Try again.");
      }
    } else {
      alert("📱 Enter a valid 10-digit mobile number.");
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === otpFromApi) {
      setVerified(true);
      setTimeout(() => {
        alert("✅ Mobile Number Verified Successfully!");
      }, 500);
    } else {
      setShake(true);
      navigator.vibrate?.(300); // mobile vibration
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        setShake(false);
        inputs.current[0]?.focus();
      }, 500);
    }
  };

  return (
    <div className="glass-container">
      <motion.div
        className={`mobilenumber ${step === 2 ? "glass-card" : ""}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="glass-title">
                <img
                  className="icons-otp"
                  src="https://img.icons8.com/?size=100&id=8cWmD9lajgRn&format=png&color=000000"
                  alt="mobile"
                />{" "}
                Mobile Login
              </h2>
              <input
                type="text"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="glass-input"
                placeholder="Enter your mobile number"
              />
              <button className="glass-button" onClick={handleMobileSubmit}>
                Send OTP
              </button>
            </motion.div>
          )}

          {step === 2 && !verified && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="glass-title">
                <img
                  className="icons-otp"
                  src="https://img.icons8.com/?size=100&id=vjOiS3RlnWyd&format=png&color=000000"
                  alt="otp"
                />{" "}
                Enter OTP
              </h2>
              <div className={`glass-otp-box ${shake ? "shake" : ""}`}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="glass-otp-input"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <button className="glass-button green" onClick={verifyOtp}>
                Verify OTP
              </button>
            </motion.div>
          )}

          {verified && (
            <motion.div
              key="verified"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="verified-box"
            >
              <CheckCircleIcon className="verified-icon" />
              <p className="verified-text">You're Verified!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
