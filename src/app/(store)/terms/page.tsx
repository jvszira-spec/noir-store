import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[900px] mx-auto">
      <p className="text-[10px] tracking-[0.3em] text-[#880A25] mb-4">LEGAL</p>
      <h1 className="font-display text-5xl font-light mb-4">Terms & Conditions</h1>
      <p className="text-[#6A6560] text-sm mb-12">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose prose-sm max-w-none space-y-8 text-[#9A9590]">
        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">1. Age Requirement</h2>
          <p className="leading-relaxed">You must be 21 years of age or older to purchase tobacco products from NOIR. By placing an order, you confirm that you are of legal age. We reserve the right to request age verification documentation and cancel orders where age cannot be verified.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">2. Acceptance of Terms</h2>
          <p className="leading-relaxed">By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">3. Product Information</h2>
          <p className="leading-relaxed">We make every effort to display product information accurately. Product images are for illustrative purposes. Prices are subject to change without notice. We reserve the right to limit quantities and refuse service.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">4. Orders & Payment</h2>
          <p className="leading-relaxed">All orders are subject to acceptance and product availability. We reserve the right to cancel any order. Payment must be received before orders are processed. All prices are in USD unless otherwise stated.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">5. Shipping & Delivery</h2>
          <p className="leading-relaxed">We ship only to jurisdictions where online tobacco sales are permitted. Delivery times are estimates. We are not responsible for delays caused by carriers or customs. Risk of loss transfers upon delivery.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">6. Returns & Refunds</h2>
          <p className="leading-relaxed">Due to the nature of tobacco products, we do not accept returns unless the product is damaged or defective. Contact us within 7 days of delivery to report any issues.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">7. Health Disclaimer</h2>
          <p className="leading-relaxed">WARNING: Tobacco products are addictive and harmful to your health. This includes cigarettes, cigars, and other tobacco products. Use of tobacco products can cause cancer, heart disease, stroke, lung diseases, diabetes, and COPD. We make no health claims about our products.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-light text-[#E8E3DD] mb-4">8. Governing Law</h2>
          <p className="leading-relaxed">These terms are governed by applicable federal and state law. Any disputes shall be resolved through binding arbitration. By using our service, you agree to these terms.</p>
        </section>
      </div>
    </div>
  );
}
