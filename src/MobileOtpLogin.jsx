import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import "./MobileOtpLogin.css";
import { sendOtp } from "./api"; // Your API function for sending OTP


export default function MobileOtpLogin() {
  const [step, setStep] = useState(2);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "","", "",]);
  const [otpFromApi, setOtpFromApi] = useState("");
  const [verified, setVerified] = useState(false);
  const [shake, setShake] = useState(false);
  const inputs = useRef([]);

  /**************** */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
  
      if (otp[index] === "") {
        if (index > 0) {
          inputs.current[index - 1].focus();
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };
  const handleMobileSubmit = async () => {
    if (mobile.length >= 10 && mobile.length <= 14) {
      try {
        const response = await sendOtp(mobile);
        setOtpFromApi(response.verify_code);
        setStep(2);
        setTimeout(() => inputs.current[0]?.focus(), 300);
        console.log("📨 OTP Sent:", response.verify_code);
      } catch (error) {
        console.error(error);
        alert("❌ Failed to send OTP. Try again.");
      }
    } else {
      alert("📱 Enter a valid 10-digit mobile number.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputs.current[index + 1]?.focus();
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
      navigator.vibrate?.(300);
      setOtp(["", "", "", ""]);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="glass-container">
      <motion.div
        className="glass-card"
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
              <h2 className="glass-title"><img className="icons-otp" src="https://img.icons8.com/?size=100&id=8cWmD9lajgRn&format=png&color=000000"/> Mobile Login</h2>
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
              <h2 className="glass-title"><img className="icons-otp"  src="https://img.icons8.com/?size=100&id=vjOiS3RlnWyd&format=png&color=000000"/> Enter OTP</h2>
              <div className={`glass-otp-box ${shake ? "shake" : ""}`}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="glass-otp-input"
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
