"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
    toast.success("Message sent. We'll be in touch within 24–48 hours.");
  };

  if (done) {
    return (
      <div className="py-10 text-center">
        <p className="text-[#880A25] text-[11px] tracking-[0.25em] mb-3">MESSAGE SENT</p>
        <p className="text-[#9A9590] text-sm">We'll respond within 24–48 business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">NAME</label>
        <input
          type="text"
          value={form.name}
          onChange={set("name")}
          required
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#880A25] text-[#E8E3DD] px-4 py-3 text-sm outline-none transition-colors"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">EMAIL</label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          required
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#880A25] text-[#E8E3DD] px-4 py-3 text-sm outline-none transition-colors"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
          ORDER NUMBER (OPTIONAL)
        </label>
        <input
          type="text"
          value={form.orderNumber}
          onChange={set("orderNumber")}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#880A25] text-[#E8E3DD] px-4 py-3 text-sm outline-none transition-colors"
          placeholder="NOIR-..."
        />
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">MESSAGE</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={set("message")}
          required
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#880A25] text-[#E8E3DD] px-4 py-3 text-sm outline-none transition-colors resize-none"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#880A25] hover:bg-[#6D0820] disabled:opacity-60 text-[#0D0D0D] py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors"
      >
        {loading ? "SENDING..." : "SEND MESSAGE"}
      </button>
    </form>
  );
}
