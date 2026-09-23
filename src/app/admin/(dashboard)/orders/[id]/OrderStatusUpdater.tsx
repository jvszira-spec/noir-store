"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentNotes: string;
  currentTrackingNumber?: string | null;
}

const orderStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const paymentStatuses = ["PENDING", "AUTHORIZED", "PAID", "FAILED", "REFUNDED"];

const STATUS_EMAIL_HINT: Record<string, string> = {
  PROCESSING: "📧 Customer will receive an Order Confirmed email",
  SHIPPED: "📧 Customer will receive a Shipped email with tracking number",
  DELIVERED: "📧 Customer will receive a Delivery Confirmed email",
  CANCELLED: "📧 Customer will receive a Cancellation email",
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentNotes,
  currentTrackingNumber,
}: Props) {
  const [orderStatus, setOrderStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: orderStatus, paymentStatus, notes, trackingNumber }),
      });
      if (res.ok) {
        toast.success("Order updated — customer notified by email");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const emailHint = orderStatus !== currentStatus ? STATUS_EMAIL_HINT[orderStatus] : null;

  return (
    <div className="bg-[#141414] border border-[#1E1E1E] p-5">
      <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-4 pb-3 border-b border-[#1E1E1E]">
        UPDATE ORDER
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">ORDER STATUS</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-[#E8E3DD] px-3 py-2.5 text-sm outline-none"
          >
            {orderStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">PAYMENT STATUS</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-[#E8E3DD] px-3 py-2.5 text-sm outline-none"
          >
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tracking number — always visible, especially important for SHIPPED */}
      <div className="mb-4">
        <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">
          TRACKING NUMBER
          {orderStatus === "SHIPPED" && <span className="text-[#C9A96E] ml-2">— included in shipping email</span>}
        </label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="e.g. 1Z999AA10123456784"
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-[#E8E3DD] px-3 py-2.5 text-sm outline-none placeholder-[#4A4540]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">INTERNAL NOTES</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-[#E8E3DD] px-3 py-2 text-sm outline-none resize-none"
          placeholder="Private notes about this order..."
        />
      </div>

      {/* Email hint — shows what email will be sent */}
      {emailHint && (
        <div className="mb-4 px-3 py-2.5 bg-[#1A1A0D] border border-[#3A3A1A] text-[#C9A96E] text-[11px]">
          {emailHint}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#C9A96E] hover:bg-[#B8956A] disabled:opacity-60 text-[#0D0D0D] px-6 py-2.5 text-[11px] font-semibold tracking-[0.15em] transition-colors flex items-center gap-2"
      >
        {saving && <span className="w-3 h-3 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />}
        SAVE & NOTIFY CUSTOMER
      </button>
    </div>
  );
}
