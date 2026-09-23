import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

interface Item {
  productId: string;
  quantity: number;
  name: string;
  brand?: string;
  image?: string;
}

async function getPayPalToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paypalOrderId,
      firstName, lastName, email, phone,
      address1, address2, city, state, postalCode, country,
      shippingMethod, items,
    } = body;

    if (!paypalOrderId || !email || !items?.length) {
      return Response.json({ error: "Missing required data" }, { status: 400 });
    }

    // Capture the PayPal payment
    const token = await getPayPalToken();
    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();
    if (captureData.status !== "COMPLETED") {
      return Response.json({ error: "PayPal payment not completed" }, { status: 400 });
    }

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    // Authoritative prices from DB
    const productIds = (items as Item[]).map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const serverSubtotal = (items as Item[]).reduce((sum, item) => {
      return sum + parseFloat(String(productMap.get(item.productId)!.price)) * item.quantity;
    }, 0);

    const shippingRates: Record<string, number> = {
      standard: serverSubtotal >= 75 ? 0 : 8.99,
      express: 18.99,
      overnight: 34.99,
    };
    const shippingKey = String(shippingMethod ?? "standard").toLowerCase().split(" ")[0];
    const serverShipping = shippingRates[shippingKey] ?? 8.99;
    const serverTotal = serverSubtotal + serverShipping;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerEmail: email,
          customerName: `${firstName} ${lastName}`,
          customerPhone: phone ?? null,
          subtotal: serverSubtotal,
          shippingCost: serverShipping,
          tax: 0,
          total: serverTotal,
          status: "PROCESSING",
          paymentStatus: "PAID",
          paymentMethod: "paypal",
          paymentId: captureId ?? paypalOrderId,
          shippingMethod,
          shippingAddress: {
            create: { firstName, lastName, address1, address2: address2 ?? null, city, state, postalCode, country },
          },
          items: {
            create: (items as Item[]).map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                name: product.name,
                brand: product.brand ?? null,
                price: parseFloat(String(product.price)),
                quantity: item.quantity,
                imageUrl: item.image ?? null,
              };
            }),
          },
        },
      });

      for (const item of items as Item[]) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return Response.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return Response.json({ error: "Failed to capture payment" }, { status: 500 });
  }
}
