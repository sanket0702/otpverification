import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './EmailOtpVerification.css'; // 👈 Importing the external CSS file
import OtpSuccessAnimation from '../components/OtpSuccessAnimation';

const EmailOtpVerification = () => {
  const [email, setEmail] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const[isVerified,setIsVerified]=useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const sendOtp = async () => {
    if (!email) {
      setMessage('Please enter your email.');
      setError(true);
      return;
    }

    try {
      const response = await axios.post('https://otpverification-9em1.onrender.com/auth/send-verification-code-email', { email });
      setServerOtp(response.data.code);
      setOtpSent(true);
      setMessage('OTP sent successfully to your email!');
      setError(false);
      setTimer(60);
    } catch (err) {
      console.error('Error sending OTP:', err);
      setMessage('Failed to send OTP. Please try again.');
      setError(true);
    }
  };

  const verifyOtp = () => {
    if (userOtp === serverOtp.toString()) {
      setError(false);
      setIsVerified(true);
      setMessage('🎉 OTP Verified Successfully!');
    } else {
      setError(true);
      setMessage('❌ Invalid OTP, try again.');
      if (navigator.vibrate) {
        navigator.vibrate(300);
      }
    }
  };

  const resendOtp = () => {
    sendOtp();
  };

  return (
    <div className="email-otp-container">
      <div className="email-otp-card">
        <h1 className="email-otp-title">Email Verification</h1>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your Email"
              className="email-otp-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="email-otp-button blue-gradient"
            >
              Send OTP
            </button>
          </>
        ) : isVerified?(<OtpSuccessAnimation/>) : (
          <>
            <motion.input
              type="number"
              placeholder="Enter OTP"
              className="email-otp-input"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
            />
            <button
              onClick={verifyOtp}
              className="email-otp-button green-gradient"
            >
              Verify OTP
            </button>
            
            {timer === 0 ? (
              <button
                onClick={resendOtp}
                className="email-otp-button yellow-gradient"
              >
                Resend OTP
              </button>
            ) : (
              <p className="email-otp-timer">
                Resend OTP in <span>{timer}</span> sec
              </p>
            )}
          </>
        )}



        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`email-otp-message ${error ? 'error' : 'success'}`}
          >
            {message}
          </motion.p>
        )}
       
      </div>
    </div>
  );
};

export default EmailOtpVerification;
