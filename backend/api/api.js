import axios from 'axios';

const API_KEY = "60dd5f2ae4mshae0d7043a30f4ffp1e9ca1jsnbbdbf7b850f6";

export const sendMobileOtp = async (phoneNumber) => {
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
