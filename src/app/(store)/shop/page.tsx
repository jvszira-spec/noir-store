import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import SortSelect from "./SortSelect";
import { serializeProduct } from "@/types";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of premium tobacco products.",
};

interface SearchParams {
  [key: string]: string | undefined;
  category?: string;
  sort?: string;
  page?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  cigarettes: "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp",
  cartons:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Ultra-Lights-Premium-1-sib-card-840bf57646.webp",
  cigars:     "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cohiba_S1.jpg/400px-Cohiba_S1.jpg",
};

async function getShopData(params: SearchParams) {
  try {
    const page = parseInt(params.page ?? "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (params.category) {
      const cat = await prisma.category.findUnique({ where: { slug: params.category } });
      if (cat) where.categoryId = cat.id;
    }

    const orderBy: Record<string, string> =
      params.sort === "price_asc"
        ? { price: "asc" }
        : params.sort === "price_desc"
        ? { price: "desc" }
        : params.sort === "newest"
        ? { createdAt: "desc" }
        : { featured: "desc" };

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: true, category: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    ]);

    return { products: products.map(serializeProduct), total, categories, totalPages: Math.ceil(total / limit), page };
  } catch {
    return { products: [], total: 0, categories: [], totalPages: 0, page: 1 };
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { products, total, categories, totalPages, page } = await getShopData(params);

  const activeCategory = params.category ?? "";

  return (
    <div className="min-h-screen">
      {/* Page title */}
      <div className="border-b border-[#ECEAE6] py-10 px-6 lg:px-10 bg-[#F8F7F5]">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-[#880A25] mb-2">
            {activeCategory ? `SHOP / ${activeCategory.replace(/-/g, " ").toUpperCase()}` : "SHOP ALL"}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-[-0.02em] text-[#1A1A1A]">
            {activeCategory
              ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/-/g, " ")
              : "The Collection"}
          </h1>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-b border-[#ECEAE6] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-5">
            {/* ALL tile */}
            <Link
              href="/shop"
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 min-w-[110px] ${
                !activeCategory
                  ? "border-[#880A25] bg-[#FFF0F2]"
                  : "border-[#EADCDF] hover:border-[#C8A0A8] bg-white"
              }`}
            >
              <div className="w-20 h-20 bg-[#F8F7F5] rounded-xl flex items-center justify-center">
                <span className={`text-sm font-bold tracking-[0.05em] ${!activeCategory ? "text-[#880A25]" : "text-[#9A9590]"}`}>ALL</span>
              </div>
              <span className={`text-[11px] font-medium text-center whitespace-nowrap ${!activeCategory ? "text-[#880A25]" : "text-[#6A6560]"}`}>
                All Products
              </span>
            </Link>

            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              const iconUrl = cat.image || CATEGORY_ICONS[cat.slug] || null;
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 min-w-[110px] ${
                    isActive
                      ? "border-[#880A25] bg-[#FFF0F2]"
                      : "border-[#EADCDF] hover:border-[#C8A0A8] bg-white"
                  }`}
                >
                  <div className="w-20 h-20 relative overflow-hidden rounded-xl bg-[#F8F7F5]">
                    {iconUrl
                      ? <Image src={iconUrl} alt={cat.name} fill className="object-cover" sizes="80px" />
                      : <div className="w-full h-full bg-[#EADCDF]" />
                    }
                    {iconUrl?.includes('ccw.delivery') && (
                      <div className="absolute bottom-0 right-0 w-[24%] h-[16%] bg-[#F8F7F5]" aria-hidden="true" />
                    )}
                  </div>
                  <span className={`text-[11px] font-medium text-center whitespace-nowrap ${isActive ? "text-[#880A25]" : "text-[#6A6560]"}`}>
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar: count + sort */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between border-b border-[#ECEAE6]">
        <p className="text-[#9A9590] text-sm">
          Showing {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} of {total} results
        </p>
        <Suspense fallback={<div className="w-40 h-9 bg-white border border-[#ECEAE6]" />}>
          <SortSelect current={params.sort} />
        </Suspense>
      </div>

      {/* Product grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[#9A9590] text-lg mb-4">No products found</p>
            <Link href="/shop" className="text-[#880A25] hover:underline text-sm">View all products</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                {page > 1 && (
                  <a
                    href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                    className="px-4 h-9 flex items-center text-sm border border-[#DDD8D3] text-[#9A9590] hover:border-[#880A25] hover:text-[#880A25] transition-colors"
                  >
                    ← Prev
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                    className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors duration-200 ${
                      p === page
                        ? "border-[#880A25] text-[#880A25] bg-[#880A25]/10"
                        : "border-[#DDD8D3] text-[#9A9590] hover:border-[#880A25] hover:text-[#880A25]"
                    }`}
                  >
                    {p}
                  </a>
                ))}
                {page < totalPages && (
                  <a
                    href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                    className="px-4 h-9 flex items-center text-sm border border-[#DDD8D3] text-[#9A9590] hover:border-[#880A25] hover:text-[#880A25] transition-colors"
                  >
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
