"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

const settingFields = [
  { key: "storeName", label: "Store Name", placeholder: "NOIR" },
  { key: "storeEmail", label: "Contact Email", placeholder: "support@noir-store.com" },
  { key: "storePhone", label: "Phone Number", placeholder: "+1 (555) 000-0000" },
  { key: "announcementBar", label: "Announcement Bar Text", placeholder: "FREE SHIPPING OVER $75" },
  { key: "freeShippingThreshold", label: "Free Shipping Threshold ($)", placeholder: "75" },
  { key: "ageVerificationRequired", label: "Age Verification Required", placeholder: "true" },
  { key: "currency", label: "Currency", placeholder: "USD" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { setSettings(d.settings ?? {}); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success("Settings saved");
      else toast.error("Save failed");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Settings</h1>

      {loading ? (
        <p className="text-[#6A6560]">Loading...</p>
      ) : (
        <div className="max-w-2xl space-y-8">
          <div className="bg-[#141414] border border-[#1E1E1E] p-6">
            <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
              STORE SETTINGS
            </h2>
            <div className="space-y-4">
              {settingFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
                    {field.label.toUpperCase()}
                  </label>
                  <input
                    value={settings[field.key] ?? ""}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#1E1E1E] p-6">
            <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-4 pb-3 border-b border-[#1E1E1E]">
              PAYMENT CONFIGURATION
            </h2>
            <p className="text-[#6A6560] text-sm mb-3">
              Payment credentials are configured via environment variables (.env), not stored in the database.
            </p>
            <div className="space-y-2 text-[12px] text-[#4A4540]">
              <p>• STRIPE_PUBLISHABLE_KEY — Your Stripe publishable key</p>
              <p>• STRIPE_SECRET_KEY — Your Stripe secret key</p>
              <p>• STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#B8956A] disabled:opacity-60 text-[#0D0D0D] px-8 py-3 text-[11px] font-semibold tracking-[0.15em] transition-colors"
          >
            <Save className="w-4 h-4" strokeWidth={2} />
            {saving ? "SAVING..." : "SAVE SETTINGS"}
          </button>
        </div>
      )}
    </div>
  );
}
