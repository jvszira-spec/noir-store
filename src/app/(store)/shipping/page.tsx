import type { Metadata } from "next";
import { Truck, Package, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[900px] mx-auto">
      <p className="text-[10px] tracking-[0.3em] text-[#880A25] mb-4">DELIVERY</p>
      <h1 className="font-display text-5xl font-light mb-12">Shipping Information</h1>

      <div className="space-y-10">
        <section className="bg-[#141414] border border-[#2A2A2A] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-[#880A25]" strokeWidth={1.5} />
            <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590]">SHIPPING OPTIONS</h2>
          </div>
          <div className="space-y-3">
            {[
              { method: "Standard Shipping", time: "5–7 business days", price: "$8.99" },
              { method: "Express Shipping", time: "2–3 business days", price: "$18.99" },
              { method: "Overnight", time: "Next business day", price: "$34.99" },
              { method: "Free Standard", time: "5–7 business days", price: "Orders over $75" },
            ].map((row) => (
              <div key={row.method} className="grid grid-cols-3 text-sm gap-4 py-2 border-b border-[#1E1E1E] last:border-0">
                <span className="text-[#E8E3DD]">{row.method}</span>
                <span className="text-[#9A9590]">{row.time}</span>
                <span className="text-[#880A25]">{row.price}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-[#880A25]" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-light">Packaging</h2>
          </div>
          <p className="text-[#9A9590] text-[15px] leading-relaxed">
            All orders are shipped in discreet, plain packaging. The return address will not
            identify the contents of the package. Orders are carefully packed to prevent
            damage during transit.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#880A25]" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-light">Shipping Restrictions</h2>
          </div>
          <p className="text-[#9A9590] text-[15px] leading-relaxed mb-4">
            Tobacco products are subject to shipping restrictions in certain jurisdictions.
            We currently ship within the United States, excluding states and localities where
            online tobacco sales are prohibited by law. It is the customer's responsibility to
            be aware of the laws in their jurisdiction.
          </p>
          <p className="text-[#9A9590] text-[15px] leading-relaxed">
            Age verification is required. By placing an order, you confirm you are 21 years of
            age or older. Deliveries may require an adult signature.
          </p>
        </section>

        <section className="bg-[#141414] border border-[#880A25]/20 p-6">
          <h2 className="text-[11px] tracking-[0.2em] text-[#880A25] mb-3">IMPORTANT NOTICE</h2>
          <p className="text-[#6A6560] text-sm leading-relaxed">
            Federal law prohibits shipping cigarettes via USPS. Compliant carriers are used
            for all tobacco product shipments. Additional carrier surcharges may apply for
            tobacco products. Any applicable taxes will be calculated and disclosed at checkout.
          </p>
        </section>
      </div>
    </div>
  );
}
