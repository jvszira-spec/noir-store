"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const subtotal = totalPrice();
  const freeShippingThreshold = 75;
  const shippingEstimate = subtotal >= freeShippingThreshold ? 0 : 8.99;
  const total = subtotal + shippingEstimate;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        <ShoppingBag className="w-16 h-16 text-[#2A2A2A] mb-6" strokeWidth={1} />
        <h1 className="font-display text-4xl font-light mb-4">Your cart is empty</h1>
        <p className="text-[#6A6560] mb-8">
          Explore our collection to find something you love.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 bg-[#880A25] hover:bg-[#6D0820] text-[#0D0D0D] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors"
        >
          SHOP COLLECTION
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[1400px] mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-light mb-12">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-[#1E1E1E]">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5 py-6">
              <Link href={`/product/${item.slug}`} className="flex-shrink-0 w-24 h-28 bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2A2A2A]" />
                )}
              </Link>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {item.brand && (
                      <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">{item.brand}</p>
                    )}
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm text-[#E8E3DD] hover:text-[#880A25] transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                    className="text-[#4A4540] hover:text-[#E05252] transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-[#2A2A2A]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#6A6560] hover:text-[#E8E3DD] transition-colors"
                    >
                      <Minus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.inventory}
                      className="w-8 h-8 flex items-center justify-center text-[#6A6560] hover:text-[#E8E3DD] disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                  <span className="text-sm text-[#880A25] font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#141414] border border-[#2A2A2A] p-6 sticky top-24">
            <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-6">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#6A6560]">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6A6560]">Shipping estimate</span>
                <span className={shippingEstimate === 0 ? "text-[#52B788]" : ""}>
                  {shippingEstimate === 0 ? "FREE" : formatCurrency(shippingEstimate)}
                </span>
              </div>
              {subtotal < freeShippingThreshold && (
                <p className="text-[11px] text-[#880A25]">
                  Add {formatCurrency(freeShippingThreshold - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated total</span>
                <span className="text-[#880A25]">{formatCurrency(total)}</span>
              </div>
              <p className="text-[11px] text-[#4A4540] mt-1">
                Taxes calculated at checkout
              </p>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-3 w-full bg-[#880A25] hover:bg-[#6D0820] text-[#0D0D0D] py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors"
            >
              CHECKOUT
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="flex items-center justify-center w-full text-[11px] tracking-[0.15em] text-[#6A6560] hover:text-[#9A9590] py-4 transition-colors"
            >
              CONTINUE SHOPPING
            </Link>

            <p className="text-[10px] text-[#4A4540] text-center mt-2">
              Age verification required · For 21+ only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
