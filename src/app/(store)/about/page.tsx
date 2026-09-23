import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About NOIR",
  description: "The story behind NOIR — a premium tobacco and smoke products store.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=1800&q=80"
            alt="About NOIR"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pb-16 w-full">
          <p className="text-[10px] tracking-[0.3em] text-[#880A25] mb-4">OUR STORY</p>
          <h1 className="font-display text-5xl md:text-7xl font-light tracking-[-0.02em]">
            About NOIR
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[900px] mx-auto px-6 lg:px-10 py-20">
        <div className="space-y-12">
          <div>
            <h2 className="font-display text-3xl font-light mb-6">
              A commitment to quality
            </h2>
            <p className="text-[#9A9590] text-[15px] leading-relaxed mb-4">
              NOIR was founded on a simple premise: that tobacco products deserve to be
              presented and sold with the same care and attention as any other premium
              consumer product. Too often, tobacco retail is an afterthought — poorly
              lit shelves, indifferent service, no curation.
            </p>
            <p className="text-[#9A9590] text-[15px] leading-relaxed">
              We set out to build something different. A store where every product is
              carefully selected, presented beautifully, and sold with full transparency
              about what it is, where it comes from, and who makes it.
            </p>
          </div>

          <div className="border-l-2 border-[#880A25] pl-8 py-2">
            <p className="font-display text-2xl font-light italic text-[#E8E3DD]">
              "Quality, selection, and simplicity — three values that guide everything we do."
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-light mb-6">
              How we curate
            </h2>
            <p className="text-[#9A9590] text-[15px] leading-relaxed mb-4">
              Every product in our collection has been evaluated by our team. We work with
              established manufacturers and importers who share our commitment to consistency
              and quality. We do not chase trends or novelty for its own sake.
            </p>
            <p className="text-[#9A9590] text-[15px] leading-relaxed">
              Our selection spans cigarettes from renowned international producers, hand-rolled
              cigars from Central America, a range of rolling products, and practical accessories
              selected for durability and function.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-light mb-6">
              Our responsibility
            </h2>
            <p className="text-[#9A9590] text-[15px] leading-relaxed mb-4">
              We sell tobacco products responsibly. We require age verification on all purchases
              and do not ship to jurisdictions where the sale is prohibited. We do not make
              health claims about our products. Tobacco use carries serious health risks.
            </p>
            <p className="text-[#9A9590] text-[15px] leading-relaxed">
              Our products are intended for adults 21 and older who are already tobacco users and
              are making their own informed choices.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-[#880A25] hover:bg-[#6D0820] text-[#0D0D0D] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors"
          >
            SHOP THE COLLECTION
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-[#2A2A2A] hover:border-[#4A4540] text-[#9A9590] hover:text-[#E8E3DD] px-8 py-4 text-[11px] tracking-[0.2em] transition-all"
          >
            CONTACT US
          </Link>
        </div>
      </section>
    </div>
  );
}
