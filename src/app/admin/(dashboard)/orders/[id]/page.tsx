import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import OrderStatusUpdater from "./OrderStatusUpdater";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Detail | Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  });
  if (!order) notFound();

  const statusColors: Record<string, string> = {
    PENDING: "text-[#C9A96E] bg-[#C9A96E]/10",
    PROCESSING: "text-[#9A9590] bg-[#9A9590]/10",
    SHIPPED: "text-[#52B788] bg-[#52B788]/10",
    DELIVERED: "text-[#52B788] bg-[#52B788]/10",
    CANCELLED: "text-[#E05252] bg-[#E05252]/10",
    PAID: "text-[#52B788] bg-[#52B788]/10",
    FAILED: "text-[#E05252] bg-[#E05252]/10",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-[10px] tracking-[0.1em] text-[#6A6560] hover:text-[#C9A96E] transition-colors mb-2 block">
            ← ORDERS
          </Link>
          <h1 className="font-display text-3xl font-light">{order.orderNumber}</h1>
          <p className="text-[#6A6560] text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] tracking-[0.1em] px-3 py-1.5 ${statusColors[order.status] ?? ""}`}>
            {order.status}
          </span>
          <span className={`text-[10px] tracking-[0.1em] px-3 py-1.5 ${statusColors[order.paymentStatus] ?? ""}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#141414] border border-[#1E1E1E] p-5">
            <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-4 pb-3 border-b border-[#1E1E1E]">
              ORDER ITEMS
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#0F0F0F] last:border-0">
                  <div>
                    {item.brand && <p className="text-[10px] text-[#6A6560]">{item.brand}</p>}
                    <p className="text-sm text-[#E8E3DD]">{item.name}</p>
                    {item.sku && <p className="text-[10px] text-[#4A4540]">SKU: {item.sku}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatCurrency(parseFloat(String(item.price)))} × {item.quantity}</p>
                    <p className="text-[#C9A96E] text-sm">{formatCurrency(parseFloat(String(item.price)) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#2A2A2A] space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6A6560]">Subtotal</span>
                <span>{formatCurrency(parseFloat(String(order.subtotal)))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6A6560]">Shipping ({order.shippingMethod})</span>
                <span>{formatCurrency(parseFloat(String(order.shippingCost)))}</span>
              </div>
              {parseFloat(String(order.tax)) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6A6560]">Tax</span>
                  <span>{formatCurrency(parseFloat(String(order.tax)))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-[#1E1E1E]">
                <span>Total</span>
                <span className="text-[#C9A96E]">{formatCurrency(parseFloat(String(order.total)))}</span>
              </div>
            </div>
          </div>

          {/* Update status */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.paymentStatus}
            currentNotes={order.notes ?? ""}
            currentTrackingNumber={order.trackingNumber ?? ""}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-[#141414] border border-[#1E1E1E] p-5">
            <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-3 pb-2 border-b border-[#1E1E1E]">
              CUSTOMER
            </h2>
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-sm text-[#9A9590]">{order.customerEmail}</p>
            {order.customerPhone && (
              <p className="text-sm text-[#9A9590]">{order.customerPhone}</p>
            )}
          </div>

          {/* Delivery */}
          {order.shippingAddress && (
            <div className="bg-[#141414] border border-[#1E1E1E] p-5">
              <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-3 pb-2 border-b border-[#1E1E1E]">
                DELIVERY ADDRESS
              </h2>
              <div className="text-sm text-[#9A9590] space-y-0.5">
                <p className="text-[#E8E3DD]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
