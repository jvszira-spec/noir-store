import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductGallery from "@/components/store/ProductGallery";
import ProductActions from "./ProductActions";
import ProductCard from "@/components/store/ProductCard";
import ReviewSection from "@/components/store/ReviewSection";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Package, Truck, ShieldCheck } from "lucide-react";
import { serializeProduct } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { images: true, category: true },
    take: 4,
  }).then((p) => p.map(serializeProduct));

  const price = parseFloat(String(product.price));
  const compareAtPrice = product.compareAtPrice
    ? parseFloat(String(product.compareAtPrice))
    : null;
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const sortedImages = [...product.images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#1E1E1E] px-6 lg:px-10 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-[11px] text-[#6A6560]">
          <Link href="/" className="hover:text-[#9A9590] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#9A9590] transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-[#9A9590] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#9A9590] truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <ProductGallery images={sortedImages} productName={product.name} />

          {/* Info */}
          <div className="flex flex-col gap-6 lg:pt-4">
            {product.brand && (
              <p className="text-[11px] tracking-[0.2em] text-[#880A25]">
                {product.brand}
              </p>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-light leading-tight tracking-[-0.01em]">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl text-[#E8E3DD]">{formatCurrency(price)}</span>
              {compareAtPrice && compareAtPrice > price && (
                <>
                  <span className="text-[#4A4540] text-lg line-through">
                    {formatCurrency(compareAtPrice)}
                  </span>
                  <span className="bg-[#880A25] text-[#0D0D0D] text-[10px] font-bold tracking-[0.1em] px-2 py-0.5">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.inventory > (product.lowStockThreshold ?? 5)
                    ? "bg-[#52B788]"
                    : product.inventory > 0
                    ? "bg-[#880A25]"
                    : "bg-[#E05252]"
                }`}
              />
              <span className="text-sm text-[#9A9590]">
                {product.inventory <= 0
                  ? "Out of stock"
                  : product.inventory <= (product.lowStockThreshold ?? 5)
                  ? `Low stock — only ${product.inventory} left`
                  : "In stock"}
              </span>
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-[#9A9590] text-[15px] leading-relaxed border-t border-[#1E1E1E] pt-5">
                {product.shortDescription}
              </p>
            )}

            {/* Actions */}
            <ProductActions
              productId={product.id}
              productName={product.name}
              brand={product.brand ?? undefined}
              price={price}
              inventory={product.inventory}
              slug={product.slug}
              image={sortedImages[0]?.url}
            />

            {/* Details */}
            {(product.sku || product.category) && (
              <div className="border-t border-[#1E1E1E] pt-5 space-y-2">
                {product.sku && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#6A6560] w-16">SKU</span>
                    <span className="text-[#9A9590]">{product.sku}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#6A6560] w-16">Category</span>
                    <Link
                      href={`/shop?category=${product.category.slug}`}
                      className="text-[#9A9590] hover:text-[#880A25] transition-colors"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Shipping info */}
            <div className="border-t border-[#1E1E1E] pt-5 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Truck className="w-4 h-4 text-[#880A25] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[#E8E3DD] mb-0.5">Free shipping on orders over $75</p>
                  <p className="text-[#6A6560] text-xs">3-7 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Package className="w-4 h-4 text-[#880A25] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[#E8E3DD] mb-0.5">Discreet packaging</p>
                  <p className="text-[#6A6560] text-xs">All orders shipped in plain packaging</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#880A25] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-[#E8E3DD] mb-0.5">Age verification required</p>
                  <p className="text-[#6A6560] text-xs">Must be 19+ to purchase tobacco products in Canada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-20 max-w-3xl">
            <h2 className="font-display text-2xl font-light mb-6">Product Details</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#9A9590] leading-relaxed whitespace-pre-line text-[15px]">
                {product.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      <ReviewSection
        productId={product.id}
        productName={product.name}
        avgRating={product.avgRating ?? null}
        reviewCount={product.reviewCount ?? 0}
      />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#1E1E1E] py-20 px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-display text-3xl font-light mb-10">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
