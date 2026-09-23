import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[900px] mx-auto">
      <p className="text-[10px] tracking-[0.3em] text-[#880A25] mb-4">LEGAL</p>
      <h1 className="font-display text-5xl font-light mb-4">Privacy Policy</h1>
      <p className="text-[#6A6560] text-sm mb-12">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-8 text-[#9A9590]">
        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">Information We Collect</h2>
          <p className="leading-relaxed">When you place an order, we collect your name, email address, phone number, and shipping address. We do not store payment card information — all payment data is handled by our payment processor.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">How We Use Your Information</h2>
          <p className="leading-relaxed">We use your information solely to process and fulfill your orders, comply with legal obligations (including age verification and tax requirements), and communicate with you about your order. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">Data Retention</h2>
          <p className="leading-relaxed">Order information is retained for the period required by applicable law and for legitimate business purposes including fraud prevention and compliance with tobacco sale regulations.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">Cookies</h2>
          <p className="leading-relaxed">We use strictly necessary cookies to maintain your cart session. We do not use advertising or tracking cookies from third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">Your Rights</h2>
          <p className="leading-relaxed">You may request access to, correction of, or deletion of your personal data by contacting us at privacy@noir-store.com. Note that certain information may be retained to comply with legal obligations.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">Contact</h2>
          <p className="leading-relaxed">For privacy-related questions, contact us at privacy@noir-store.com.</p>
        </section>
      </div>
    </div>
  );
}
