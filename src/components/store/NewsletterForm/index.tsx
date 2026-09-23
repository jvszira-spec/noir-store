"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        setEmail("");
        toast.success("You're on the list.");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <p className="text-[#880A25] text-[11px] tracking-[0.2em] py-4">
        SUBSCRIBED — THANK YOU
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] border-r-0 text-[#E8E3DD] placeholder-[#4A4540] px-4 py-3.5 text-sm outline-none focus:border-[#880A25] transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#880A25] hover:bg-[#6D0820] disabled:opacity-60 text-[#0D0D0D] px-6 text-[11px] font-semibold tracking-[0.15em] transition-colors duration-200 whitespace-nowrap"
      >
        {loading ? "..." : "SUBSCRIBE"}
      </button>
    </form>
  );
}
