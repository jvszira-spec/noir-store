import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import NewsletterForm from "@/components/store/NewsletterForm";
import type { Metadata } from "next";
import { serializeProduct } from "@/types";

export const metadata: Metadata = {
  title: "NOIR — Buy Cigarettes & Tobacco Online Canada",
  description: "Compare popular brands, formats and prices in one clear, fast and mobile-friendly NOIR catalog. Free shipping over $75.",
};

async function getHomeData() {
  try {
    const [popularProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: { images: true, category: true },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    return { popularProducts: popularProducts.map(serializeProduct), categories };
  } catch {
    return { popularProducts: [], categories: [] };
  }
}

const CCW = "https://ccw.delivery/wp-content/uploads/2026/05/";

const categoryImages: Record<string, string> = {
  cigarettes: CCW + "CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp",
  cartons:    CCW + "CCW-Canadian-Cigarette-Wholesale-Canadian-Ultra-Lights-Premium-1-sib-card-840bf57646.webp",
  cigars:     CCW + "CCW-Canadian-Cigarette-Wholesale-Prime-Time-Vanilla-2-sib-card-840bf57646.webp",
};

export default async function HomePage() {
  const { popularProducts, categories } = await getHomeData();

  return (
    <div className="bg-[#F2F0ED] min-h-screen">

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-[#880A25] text-white overflow-hidden">
        <div className="flex animate-none">
          <div className="flex items-center justify-center gap-8 py-2.5 w-full flex-wrap px-4">
            <span className="text-[11px] font-medium whitespace-nowrap">🚚 Free delivery on orders of $75 or more Canada-wide</span>
            <span className="text-[11px] font-medium whitespace-nowrap hidden sm:block">🎁 Get 10% off your first order of $50 or more</span>
            <span className="text-[11px] font-medium whitespace-nowrap hidden md:block">✅ Adults 19+ only · Code: <strong>WELCOMENOIR</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-5 space-y-4">

        {/* ── HERO CARD ── */}
        <section className="rounded-2xl overflow-hidden bg-[#F5EDE3] relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">

            {/* Left content */}
            <div className="flex flex-col justify-center p-8 lg:p-12 z-10 relative">
              <div className="mb-5">
                <span className="text-2xl font-display font-bold tracking-[0.15em] text-[#880A25]">NOIR</span>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#2D1A1A] text-white text-[11px] font-semibold tracking-[0.12em] px-4 py-2 rounded-full w-fit mb-5 hover:bg-[#880A25] transition-colors"
              >
                BROWSE THE CATALOGUE <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A0A0A] leading-tight mb-4">
                Find your<br />
                <span className="text-[#880A25]">favourite brand</span>
              </h1>
              <p className="text-[#5A4040] text-[15px] leading-relaxed mb-8 max-w-sm">
                Compare popular brands, formats and prices in one clear, fast catalog. Premium Canadian tobacco delivered to your door.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#880A25] hover:bg-[#6D0820] text-white text-[13px] font-semibold px-6 py-3 rounded-full w-fit transition-colors"
              >
                View all products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — product images */}
            <div className="relative flex items-center justify-center p-6 lg:p-10 min-h-[280px]">
              {/* Maple leaf watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-64 h-64 text-[#880A25]" fill="currentColor">
                  <path d="M50 5 L55 35 L85 25 L70 50 L95 55 L70 60 L80 90 L50 75 L20 90 L30 60 L5 55 L30 50 L15 25 L45 35 Z" />
                </svg>
              </div>
              {/* Product images stacked */}
              <div className="relative w-full h-[260px] lg:h-[320px]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-40 lg:w-52 lg:h-52 z-30 drop-shadow-xl">
                  <Image
                    src={CCW + "CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp"}
                    alt="Canadian Classics"
                    fill
                    className="object-contain"
                    priority
                    sizes="208px"
                  />
                </div>
                <div className="absolute right-28 lg:right-36 top-1/2 -translate-y-[60%] w-36 h-36 lg:w-44 lg:h-44 z-20 drop-shadow-lg">
                  <Image
                    src={CCW + "CCW-Canadian-Cigarette-Wholesale-Canadian-Ultra-Lights-Premium-1-sib-card-840bf57646.webp"}
                    alt="Canadian Ultra Lights Carton"
                    fill
                    className="object-contain"
                    sizes="176px"
                  />
                </div>
                <div className="absolute right-16 lg:right-20 top-1/2 translate-y-[10%] w-32 h-32 lg:w-40 lg:h-40 z-10 drop-shadow-md opacity-80">
                  <Image
                    src={CCW + "CCW-Canadian-Cigarette-Wholesale-Prime-Time-Vanilla-2-sib-card-840bf57646.webp"}
                    alt="Prime Time"
                    fill
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INFO BANNER ── */}
        <section className="rounded-2xl bg-white p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#880A25] mb-3">CANADIAN CIGARETTE STORE</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A0A0A] leading-snug mb-3 max-w-lg">
              Looking to buy tobacco online?
            </h2>
            <p className="text-[#6A5A5A] text-[14px] leading-relaxed max-w-lg">
              Compare popular brands, formats and prices in one clear, fast and mobile-friendly NOIR catalog.
              Products and prices are always up to date.
            </p>
          </div>
          <Link
            href="/shop"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#880A25] hover:bg-[#6D0820] text-white text-[13px] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Shop all products <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* ── CATEGORY STRIP ── */}
        <section className="rounded-2xl bg-white p-8 lg:p-10">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#880A25] mb-2">SHOP BY CATEGORY</p>
          <h2 className="text-2xl font-bold text-[#1A0A0A] mb-2">Find what you need faster</h2>
          <p className="text-[#6A5A5A] text-[14px] mb-7">
            Browse the NOIR catalog by category. Products and prices are always up to date.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* All products tile */}
            <Link
              href="/shop"
              className="flex-shrink-0 flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 rounded-xl bg-[#F5EDE3] border-2 border-[#EADCDF] group-hover:border-[#880A25] transition-colors flex items-center justify-center">
                <span className="text-xs font-bold text-[#880A25] tracking-wider">ALL</span>
              </div>
              <span className="text-[12px] text-[#2D1A1A] font-medium text-center w-20 leading-tight">All Products</span>
            </Link>

            {categories.map((cat) => {
              const imgUrl = cat.image ?? categoryImages[cat.slug];
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="flex-shrink-0 flex flex-col items-center gap-3 group"
                >
                  <div className="w-20 h-20 rounded-xl border-2 border-[#EADCDF] group-hover:border-[#880A25] transition-colors overflow-hidden relative bg-[#F8F5F2]">
                    {imgUrl && (
                      <>
                        <Image src={imgUrl} alt={cat.name} fill className="object-cover" sizes="80px" />
                        {imgUrl.includes('ccw.delivery') && (
                          <div className="absolute bottom-0 right-0 w-[24%] h-[16%] bg-[#F8F5F2]" aria-hidden="true" />
                        )}
                      </>
                    )}
                  </div>
                  <span className="text-[12px] text-[#2D1A1A] font-medium text-center w-20 leading-tight">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── POPULAR RIGHT NOW ── */}
        {popularProducts.length > 0 && (
          <section className="rounded-2xl bg-white p-8 lg:p-10">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#880A25] mb-2">POPULAR RIGHT NOW</p>
                <h2 className="text-2xl font-bold text-[#1A0A0A]">Customer favourites at NOIR</h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-[#880A25] hover:text-[#6D0820] text-[13px] font-semibold transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#880A25] hover:bg-[#6D0820] text-white text-[13px] font-semibold px-6 py-3 rounded-full transition-colors"
              >
                View all products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* ── NEWSLETTER ── */}
        <section className="rounded-2xl bg-[#2D1A1A] p-8 lg:p-12 text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#E8A0A8] mb-3">STAY IN THE KNOW</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Get deals & new arrivals first
          </h2>
          <p className="text-[#C8A0A8] text-[14px] mb-7 max-w-md mx-auto">
            Subscribe for exclusive offers, restocks, and promo codes. No spam, ever.
          </p>
          <NewsletterForm />
        </section>

        <div className="pb-4" />
      </div>
    </div>
  );
}
