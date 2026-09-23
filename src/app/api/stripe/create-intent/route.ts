import { NextRequest } from "next/server";
import stripe from "@/lib/stripe-server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

interface Item {
  productId: string;
  quantity: number;
  name: string;
  brand?: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone,
      address1, address2, city, state, postalCode, country,
      shippingMethod, items,
    } = body;

    if (!email || !firstName || !lastName || !address1 || !city || !state || !postalCode) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!items?.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Authoritative prices from DB
    const productIds = (items as Item[]).map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    for (const item of items as Item[]) {
      const product = productMap.get(item.productId);
      if (!product) return Response.json({ error: `Product unavailable: ${item.name}` }, { status: 400 });
      if (product.inventory < item.quantity)
        return Response.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
    }

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

    // Create PENDING order in DB
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
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: "card",
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

      // Reserve inventory
      for (const item of items as Item[]) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(serverTotal * 100), // cents
      currency: "usd",
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      automatic_payment_methods: { enabled: true },
    });

    // Link payment intent to order
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentIntent.id },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("create-intent error:", error);
    return Response.json({ error: "Payment setup failed" }, { status: 500 });
  }
}
