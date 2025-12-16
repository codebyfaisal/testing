import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import usePortfolioStore from "../store/usePortfolioStore";
import { cn } from "../utils/cn";

const PrivacyBanner = () => {
  const [show, setShow] = useState(false);
  const { isRounded } = usePortfolioStore();

  useEffect(() => {
    // Keeping the same key for backward compatibility or changing it?
    // Let's keep "cookie_consent_acknowledged" so users who already accepted don't see it again.
    const consent = localStorage.getItem("cookie_consent_acknowledged");
    if (!consent) {
      // Small delay for animation effect
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent_acknowledged", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up bg-transparent">
      <div
        className={cn(
          "max-w-4xl mx-auto bg-black/70 backdrop-blur-md border border-white/10 p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden",
          isRounded ? "rounded-xl" : ""
        )}
      >
        <div className="text-sm text-text-secondary text-center sm:text-left">
          <p>
            We use cookies to analyze traffic and improve your experience. By
            continuing to use this site, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <Button onClick={handleAccept} variant="primary" size="sm">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyBanner;
