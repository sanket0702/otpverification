import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const EmailOtpVerification = () => {
  const [email, setEmail] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);

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
      const response = await axios.post('https://otpverification-9em1.onrender.com/send-verification-code', { email });
      setServerOtp(response.data.code);
      setOtpSent(true);
      setMessage('OTP sent successfully to your email!');
      setError(false);
      setTimer(60); // Start resend timer
    } catch (err) {
      console.error('Error sending OTP:', err);
      setMessage('Failed to send OTP. Please try again.');
      setError(true);
    }
  };

  const verifyOtp = () => {
    if (userOtp === serverOtp.toString()) {
      setError(false);
      setMessage('🎉 OTP Verified Successfully!');
    } else {
      setError(true);
      setMessage('❌ Invalid OTP, try again.');
      if (navigator.vibrate) {
        navigator.vibrate(300); // Phone vibration
      }
    }
  };

  const resendOtp = () => {
    sendOtp();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Email Verification
        </h1>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full p-3 border-2 border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-xl transition-all duration-300"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <motion.input
              type="number"
              placeholder="Enter OTP"
              className="w-full p-3 border-2 border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded-xl mb-3 transition-all duration-300"
            >
              Verify OTP
            </button>

            {timer === 0 ? (
              <button
                onClick={resendOtp}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold p-3 rounded-xl transition-all duration-300"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-center text-gray-500 mt-2">
                Resend OTP in <span className="font-bold">{timer}</span> sec
              </p>
            )}
          </>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center text-lg font-semibold ${
              error ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default EmailOtpVerification;
