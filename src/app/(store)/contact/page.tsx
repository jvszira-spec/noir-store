import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import ContactForm from "@/components/store/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the NOIR team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[1400px] mx-auto">
      <div className="max-w-[800px]">
        <p className="text-[10px] tracking-[0.3em] text-[#880A25] mb-4">GET IN TOUCH</p>
        <h1 className="font-display text-5xl md:text-6xl font-light mb-6">Contact</h1>
        <p className="text-[#6A6560] text-[15px] mb-16 max-w-md">
          Questions about your order, shipping, or our products? We're here to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
              SEND A MESSAGE
            </h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div>
            <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
              CONTACT DETAILS
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#880A25] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">EMAIL</p>
                  <p className="text-sm">support@noir-store.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#880A25] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">HOURS</p>
                  <p className="text-sm">Monday – Friday</p>
                  <p className="text-sm text-[#9A9590]">9:00 AM – 6:00 PM EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#880A25] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">RESPONSE TIME</p>
                  <p className="text-sm">Within 24–48 business hours</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-[#141414] border border-[#2A2A2A]">
              <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-2">LEGAL NOTICE</p>
              <p className="text-[12px] text-[#4A4540] leading-relaxed">
                NOIR sells tobacco products to adults 21 and older. By contacting us regarding a
                purchase, you confirm you meet the age requirement. Tobacco sales are subject to
                applicable local, state, and federal laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
