import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been placed successfully.",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      shippingAddress: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="min-h-screen px-6 lg:px-10 py-16 max-w-[900px] mx-auto">
      {/* Success header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 border border-[#52B788] flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#52B788]" strokeWidth={1.5} />
          </div>
        </div>
        <p className="text-[10px] tracking-[0.3em] text-[#52B788] mb-3">ORDER PLACED</p>
        <h1 className="font-display text-4xl md:text-5xl font-light mb-4">
          Thank You for Your Order
        </h1>
        <p className="text-[#6A6560] text-[15px]">
          We've received your order and will process it shortly.
        </p>
      </div>

      {/* Order info */}
      <div className="bg-[#141414] border border-[#2A2A2A] p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">ORDER NUMBER</p>
            <p className="text-sm font-medium text-[#880A25]">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">DATE</p>
            <p className="text-sm">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">STATUS</p>
            <p className="text-sm text-[#52B788]">{order.status}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">PAYMENT</p>
            <p className="text-sm">{order.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Items */}
        <div>
          <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-4 pb-3 border-b border-[#1E1E1E]">
            ITEMS ORDERED
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-14 h-16 bg-[#1A1A1A] border border-[#2A2A2A] flex-shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={56}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-[#4A4540]" strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {item.brand && (
                    <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-0.5">{item.brand}</p>
                  )}
                  <p className="text-sm text-[#E8E3DD] line-clamp-2">{item.name}</p>
                  <p className="text-[11px] text-[#9A9590] mt-1">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm text-[#880A25] flex-shrink-0">
                  {formatCurrency(parseFloat(String(item.price)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-4 border-t border-[#1E1E1E] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6A6560]">Subtotal</span>
              <span>{formatCurrency(parseFloat(String(order.subtotal)))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6A6560]">Shipping</span>
              <span>{parseFloat(String(order.shippingCost)) === 0 ? "FREE" : formatCurrency(parseFloat(String(order.shippingCost)))}</span>
            </div>
            {parseFloat(String(order.tax)) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#6A6560]">Tax</span>
                <span>{formatCurrency(parseFloat(String(order.tax)))}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-[#1E1E1E]">
              <span>Total</span>
              <span className="text-[#880A25]">{formatCurrency(parseFloat(String(order.total)))}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div>
          <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-4 pb-3 border-b border-[#1E1E1E]">
            DELIVERY INFORMATION
          </h2>
          {order.shippingAddress && (
            <div className="space-y-1.5 text-sm text-[#9A9590]">
              <p className="text-[#E8E3DD]">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-[#1E1E1E]">
            <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">CONTACT</p>
            <p className="text-sm">{order.customerEmail}</p>
            {order.customerPhone && (
              <p className="text-sm text-[#9A9590]">{order.customerPhone}</p>
            )}
          </div>
          {order.shippingMethod && (
            <div className="mt-4">
              <p className="text-[10px] tracking-[0.1em] text-[#6A6560] mb-1">SHIPPING METHOD</p>
              <p className="text-sm">{order.shippingMethod}</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 bg-[#880A25] hover:bg-[#6D0820] text-[#0D0D0D] px-8 py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors"
        >
          CONTINUE SHOPPING
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/contact"
          className="text-[11px] tracking-[0.15em] text-[#6A6560] hover:text-[#9A9590] transition-colors"
        >
          NEED HELP? CONTACT US
        </Link>
      </div>

      <p className="mt-8 text-[11px] text-[#4A4540]">
        A confirmation email has been sent to {order.customerEmail}.
        Please retain your order number: <strong className="text-[#6A6560]">{order.orderNumber}</strong>
      </p>
    </div>
  );
}
