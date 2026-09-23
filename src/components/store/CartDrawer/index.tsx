"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const total = totalPrice();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-[#ECEAE6] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ECEAE6]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#880A25]" strokeWidth={1.5} />
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#1A1A1A]">YOUR CART</span>
            {items.length > 0 && (
              <span className="text-[11px] text-[#9A9590]">({items.length})</span>
            )}
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="text-[#9A9590] hover:text-[#1A1A1A] transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ShoppingBag className="w-12 h-12 text-[#DDD8D3] mb-4" strokeWidth={1} />
              <p className="text-[#9A9590] text-sm mb-6">Your cart is empty</p>
              <button onClick={closeCart} className="text-[10px] tracking-[0.2em] text-[#880A25] hover:text-[#1A1A1A] transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EFED]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5">
                  <Link href={`/product/${item.slug}`} onClick={closeCart} className="flex-shrink-0 w-20 h-24 bg-[#F8F7F5] border border-[#ECEAE6] overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={80} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#F0EFED]" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {item.brand && (
                        <p className="text-[10px] tracking-[0.1em] text-[#9A9590] mb-0.5">{item.brand}</p>
                      )}
                      <Link href={`/product/${item.slug}`} onClick={closeCart} className="text-sm text-[#1A1A1A] hover:text-[#880A25] transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#DDD8D3]">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity" className="w-7 h-7 flex items-center justify-center text-[#9A9590] hover:text-[#1A1A1A] transition-colors">
                          <Minus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm text-[#1A1A1A]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.inventory} aria-label="Increase quantity" className="w-7 h-7 flex items-center justify-center text-[#9A9590] hover:text-[#1A1A1A] disabled:opacity-30 transition-colors">
                          <Plus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#880A25] font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.id)} aria-label="Remove item" className="text-[#B5B0AB] hover:text-red-500 transition-colors">
                          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#ECEAE6] p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9A9590]">Subtotal</span>
              <span className="text-[#1A1A1A] font-medium">{formatCurrency(total)}</span>
            </div>
            <p className="text-[10px] text-[#B5B0AB]">Shipping and taxes calculated at checkout</p>
            <div className="space-y-2">
              <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-2 w-full bg-[#880A25] hover:bg-[#6D0820] text-white py-3.5 text-[11px] font-semibold tracking-[0.15em] transition-colors duration-200 rounded-full">
                CHECKOUT <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/cart" onClick={closeCart} className="flex items-center justify-center w-full border border-[#DDD8D3] hover:border-[#880A25] text-[#9A9590] hover:text-[#1A1A1A] py-3 text-[11px] tracking-[0.15em] transition-colors duration-200">
                VIEW CART
              </Link>
            </div>
            <p className="text-[10px] text-[#B5B0AB] text-center">Age verification required at checkout</p>
          </div>
        )}
      </div>
    </>
  );
}
