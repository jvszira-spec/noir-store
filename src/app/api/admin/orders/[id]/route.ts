import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  sendOrderConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
} from "@/lib/email";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  });
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status, paymentStatus, notes, trackingNumber } = await request.json();

  // Get current order before update (to detect status change)
  const before = await prisma.order.findUnique({
    where: { id },
    select: { status: true },
  });

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(notes !== undefined && { notes }),
      ...(trackingNumber !== undefined && { trackingNumber }),
    },
    include: { items: true, shippingAddress: true },
  });

  // Send email only when status actually changes
  if (status && before && status !== before.status) {
    const emailPayload = {
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      items: order.items.map((i) => ({
        name: i.name,
        brand: i.brand,
        quantity: i.quantity,
        price: Number(i.price),
      })),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
      shippingAddress: order.shippingAddress ?? null,
      trackingNumber: order.trackingNumber,
    };

    try {
      if (status === "PROCESSING") {
        await sendOrderConfirmedEmail(emailPayload);
      } else if (status === "SHIPPED") {
        await sendOrderShippedEmail(emailPayload);
      } else if (status === "DELIVERED") {
        await sendOrderDeliveredEmail(emailPayload);
      } else if (status === "CANCELLED") {
        await sendOrderCancelledEmail(emailPayload);
      }
    } catch (err) {
      // Log but don't fail the request if email fails
      console.error("Email send failed:", err);
    }
  }

  return Response.json({ order });
}
