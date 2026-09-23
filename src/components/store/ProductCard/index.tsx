"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { SerializedProduct } from "@/types";

interface Props {
  product: SerializedProduct;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const secondaryImage = product.images[1];
  const price = product.price;
  const compareAtPrice = product.compareAtPrice ?? null;
  const isOutOfStock = product.inventory <= 0;
  const isLowStock = product.inventory > 0 && product.inventory <= (product.lowStockThreshold ?? 5);
  const discountPct =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;
    setAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand ?? undefined,
      price,
      image: primaryImage?.url,
      inventory: product.inventory,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="group flex flex-col bg-[#FFFDFA] border border-[#EADCDF] hover:border-[#C8A0A8] hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden aspect-square bg-[#F8F7F5]">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#F0EFED] animate-pulse" />
        )}

        {primaryImage && !imageError ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
              } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.alt ?? product.name}
                fill
                className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#F0EFED] flex flex-col items-center justify-center gap-2">
            <span className="font-display text-lg font-semibold tracking-[0.2em] text-[#C8A0A8]">NOIR</span>
            <ShoppingBag className="w-7 h-7 text-[#EADCDF]" strokeWidth={1} />
          </div>
        )}

        {/* CCW logo blocker — covers bottom-right watermark on CCW-hosted images */}
        {primaryImage?.url?.includes('ccw.delivery') && !imageError && (
          <div className="absolute bottom-0 right-0 w-[24%] h-[16%] bg-[#F8F7F5]" aria-hidden="true" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPct && (
            <span className="bg-[#880A25] text-white text-[9px] font-bold tracking-[0.1em] px-2 py-0.5">
              {discountPct}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#1A1A1A] border border-[#3A3A3A] text-[#6A6560] text-[9px] tracking-[0.1em] px-2 py-0.5">
              SOLD OUT
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-[#1A1A1A] border border-[#880A25]/40 text-[#880A25] text-[9px] tracking-[0.1em] px-2 py-0.5">
              LOW STOCK
            </span>
          )}
        </div>
      </Link>

      {/* Info + always-visible Add to Cart */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {product.brand && (
          <p className="text-[9px] tracking-[0.15em] text-[#9A9590] uppercase">{product.brand}</p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="text-[13px] text-[#2F1820] hover:text-[#880A25] transition-colors leading-snug line-clamp-2 flex-1 font-medium"
        >
          {product.name}
        </Link>

        {/* Star rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(product.avgRating ?? 0) ? "text-[#E8A020] fill-[#E8A020]" : "text-[#DDD8D3] fill-[#DDD8D3]"}`}
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#9A9590]">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#880A25]">{formatCurrency(price)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-[#B5B0AB] line-through">{formatCurrency(compareAtPrice)}</span>
          )}
        </div>

        {/* Add to cart — always visible */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          className={`w-full mt-1 py-2.5 text-[10px] font-semibold tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isOutOfStock
              ? "bg-[#F0EFED] border border-[#DDD8D3] text-[#B5B0AB] cursor-not-allowed rounded-full"
              : adding
              ? "bg-[#6D0820] text-white rounded-full"
              : "bg-[#880A25] hover:bg-[#6D0820] text-white rounded-full"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
          {isOutOfStock ? "SOLD OUT" : adding ? "ADDED ✓" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
