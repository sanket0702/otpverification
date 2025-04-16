import axios from 'axios';

const API_KEY = "f9a07d5be2msh10c974db46924d0p1a337ajsn78a9579d666f";

export const sendOtp = async (phoneNumber) => {
    const formattedNumber = phoneNumber.startsWith('+91')
    ? phoneNumber
    : `+91${phoneNumber}`;
  const options = {
    method: 'POST',
    url: 'https://sms-verify3.p.rapidapi.com/send-numeric-verify',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'sms-verify3.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      target: formattedNumber
    },
  };

  try {
    const response = await axios.request(options);
    return response.data; // This should contain { verify_code: 'XXXX' }
  } catch (error) {
    console.error("OTP API error:", error);
    throw error;
  }
};
