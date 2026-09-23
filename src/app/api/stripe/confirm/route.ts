import { NextRequest } from "next/server";
import stripe from "@/lib/stripe-server";
import prisma from "@/lib/prisma";
import { sendOrderConfirmedEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await request.json();

    if (!paymentIntentId || !orderId) {
      return Response.json({ error: "Missing paymentIntentId or orderId" }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (pi.status !== "succeeded") {
      return Response.json({ error: `Payment not succeeded: ${pi.status}` }, { status: 400 });
    }

    if (pi.metadata.orderId !== orderId) {
      return Response.json({ error: "Order mismatch" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        paymentStatus: "PAID",
        paymentId: pi.id,
      },
      include: { items: true, shippingAddress: true },
    });

    // Send order confirmation email to customer
    try {
      await sendOrderConfirmedEmail({
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
      });
    } catch (emailErr) {
      console.error("Order confirmation email failed:", emailErr);
    }

    return Response.json({ orderId });
  } catch (error) {
    console.error("stripe confirm error:", error);
    return Response.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
