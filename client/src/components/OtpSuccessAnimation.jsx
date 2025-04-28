import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import "./OtpSuccessAnimation.css"; // Import the CSS

export default function OtpSuccessAnimation({ onClose }) {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleClose = () => {
    setShowAnimation(false);
    if (onClose) {
      onClose(); // Call the callback passed as a prop, if any
    }
  };

  return (
    <>
      {showAnimation && (
        <div className="otp-success-container">
          <div className="success-circle">
            <CheckCircle2 size={80} color="white" className="check-icon" />

            {/* Sparkles */}
            <div className="sparkle sparkle-yellow"></div>
            <div className="sparkle sparkle-pink"></div>
            <div className="sparkle sparkle-blue"></div>
          </div>

          {/* Close Button */}
          <div><img src="https://img.icons8.com/?size=100&id=11997&format=png&color=000000" className="close-button" onClick={handleClose}>
            
          </img></div>
        </div>
      )}
    </>
  );
}
