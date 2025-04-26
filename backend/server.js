// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-verification-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="width:100%; display:flex; justify-content:center; align-items:center; padding:20px;">
    <div style="width:400px; background:white; padding:30px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); text-align:center;">
      <div style="font-size:24px; font-weight:bold; color:#333333;">
        Your OTP Code
      </div>
      <div style="padding:20px 0; font-size:36px; font-weight:bold; color:#4CAF50;">
        ${verificationCode}
      </div>
      <div style="font-size:14px; color:#777777;">
        Please use this OTP to complete your verification. <br> It is valid for 10 minutes.
      </div>
    </div>
  </div>

    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent', code: verificationCode });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
