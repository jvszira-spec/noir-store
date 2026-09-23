"use client";

import { useState, useEffect } from "react";

const AGE_GATE_KEY = "noir_age_verified";

export default function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(AGE_GATE_KEY);
    if (!verified) setShow(true);
  }, []);

  const handleEnter = () => {
    localStorage.setItem(AGE_GATE_KEY, "1");
    setShow(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#FFFFF8] border border-[#EADCDF] max-w-md w-full mx-4 p-8 text-center shadow-2xl">
        {/* Top accent */}
        <div className="w-full h-1 bg-[#880A25] absolute top-0 left-0" />

        <div className="mb-6">
          <span className="font-display text-4xl font-bold tracking-[0.3em] text-[#880A25]">NOIR</span>
        </div>

        <div className="w-12 h-12 bg-[#880A25]/10 border border-[#880A25]/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-[#880A25]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#2F1820] mb-2">Age Verification Required</h2>
        <p className="text-[#6A5A5A] text-sm leading-relaxed mb-6">
          This website sells tobacco products. You must be{" "}
          <strong className="text-[#2F1820]">19 years of age or older</strong> to enter.
          <br />
          By entering, you confirm you are of legal age in your province or territory.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleEnter}
            className="w-full bg-[#880A25] hover:bg-[#6D0820] text-white py-3.5 text-[13px] font-semibold tracking-[0.1em] transition-colors rounded-sm"
          >
            YES, I AM 19 OR OLDER — ENTER
          </button>
          <button
            onClick={handleExit}
            className="w-full bg-white hover:bg-[#F8F7F5] text-[#6A5A5A] border border-[#EADCDF] py-3 text-[12px] font-medium transition-colors rounded-sm"
          >
            No, I am under 19 — Exit
          </button>
        </div>

        <p className="mt-5 text-[10px] text-[#B5B0AB] leading-relaxed">
          By entering this site, you agree to our{" "}
          <a href="/terms" className="underline hover:text-[#880A25]">Terms & Conditions</a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-[#880A25]">Privacy Policy</a>.
          Tobacco products are intended for adults only.
        </p>
      </div>
    </div>
  );
}
