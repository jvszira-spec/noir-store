import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Search } from "lucide-react";
import { serializeProduct } from "@/types";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: { images: true, category: true },
        take: 24,
      }).then((p) => p.map(serializeProduct))
    : [];

  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[1400px] mx-auto">
      {/* Search bar */}
      <form method="get" action="/search" className="mb-12 max-w-xl">
        <div className="flex items-center border border-[#2A2A2A] focus-within:border-[#880A25] transition-colors">
          <Search className="w-5 h-5 text-[#6A6560] ml-4 flex-shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search products, brands, categories..."
            className="flex-1 bg-transparent text-[#E8E3DD] placeholder-[#4A4540] px-4 py-4 outline-none text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="bg-[#880A25] hover:bg-[#6D0820] text-[#0D0D0D] px-5 py-4 text-[11px] font-semibold tracking-[0.15em] transition-colors flex-shrink-0"
          >
            SEARCH
          </button>
        </div>
      </form>

      {query ? (
        <>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-light mb-2">
              {products.length > 0
                ? `Results for "${query}"`
                : `No results for "${query}"`}
            </h1>
            <p className="text-[#6A6560] text-sm">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-[#6A6560] mb-4">
                Try adjusting your search or browse our categories.
              </p>
              <Link
                href="/shop"
                className="text-[#880A25] text-sm hover:underline"
              >
                View all products →
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <h1 className="font-display text-3xl font-light text-[#6A6560]">
            Search the Collection
          </h1>
        </div>
      )}
    </div>
  );
}
