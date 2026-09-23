"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Props {
  productId: string;
  productName: string;
  brand?: string;
  price: number;
  inventory: number;
  slug: string;
  image?: string;
}

export default function ProductActions({
  productId,
  productName,
  brand,
  price,
  inventory,
  slug,
  image,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();
  const isOutOfStock = inventory <= 0;

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(inventory, q + 1));

  const handleAdd = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({ id: productId, name: productName, brand, price, image, inventory, slug });
    }
    toast.success(`${quantity}× ${productName} added to cart`);
    openCart();
  };

  if (isOutOfStock) {
    return (
      <div className="space-y-3 mt-2">
        <div className="w-full border border-[#2A2A2A] text-[#4A4540] text-center py-4 text-[11px] tracking-[0.15em]">
          OUT OF STOCK
        </div>
        <p className="text-[12px] text-[#6A6560] text-center">
          This product is currently unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-[11px] tracking-[0.1em] text-[#6A6560] w-20">QUANTITY</span>
        <div className="flex items-center border border-[#2A2A2A]">
          <button
            onClick={dec}
            disabled={quantity <= 1}
            aria-label="Decrease"
            className="w-10 h-10 flex items-center justify-center text-[#6A6560] hover:text-[#E8E3DD] disabled:opacity-30 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={inc}
            disabled={quantity >= inventory}
            aria-label="Increase"
            className="w-10 h-10 flex items-center justify-center text-[#6A6560] hover:text-[#E8E3DD] disabled:opacity-30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
        {inventory <= (5) && (
          <span className="text-[11px] text-[#880A25]">
            Only {inventory} left
          </span>
        )}
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className="flex items-center justify-center gap-3 w-full bg-[#880A25] hover:bg-[#6D0820] text-[#0D0D0D] py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors duration-200"
      >
        <ShoppingBag className="w-4 h-4" strokeWidth={2} />
        ADD TO CART
      </button>

      {/* Checkout CTA */}
      <Link
        href="/checkout"
        className="flex items-center justify-center gap-3 w-full border border-[#2A2A2A] hover:border-[#4A4540] text-[#9A9590] hover:text-[#E8E3DD] py-4 text-[11px] tracking-[0.2em] transition-all duration-200"
      >
        BUY NOW
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
