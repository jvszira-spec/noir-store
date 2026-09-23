import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

interface CheckoutItem {
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
      agreeToTerms, ageConfirmation,
    } = body;

    if (!firstName || !lastName || !email || !address1 || !city || !state || !postalCode || !country) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!agreeToTerms || !ageConfirmation) {
      return Response.json({ error: "Age and terms confirmation required" }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return Response.json({ error: "No items in cart" }, { status: 400 });
    }

    // Fetch authoritative prices and inventory from DB — never trust client-sent prices
    const productIds = (items as CheckoutItem[]).map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    for (const item of items as CheckoutItem[]) {
      const product = productMap.get(item.productId);
      if (!product) {
        return Response.json({ error: `Product not available: ${item.name}` }, { status: 400 });
      }
      if (product.inventory < item.quantity) {
        return Response.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.inventory}` },
          { status: 400 }
        );
      }
    }

    // Calculate totals server-side from DB prices
    const serverSubtotal = (items as CheckoutItem[]).reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + parseFloat(String(product.price)) * item.quantity;
    }, 0);

    const FREE_SHIPPING_THRESHOLD = 75;
    const shippingRates: Record<string, number> = {
      standard: serverSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 8.99,
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
          customerPhone: phone,
          subtotal: serverSubtotal,
          shippingCost: serverShipping,
          tax: 0,
          total: serverTotal,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: "card",
          shippingMethod,
          shippingAddress: {
            create: {
              firstName,
              lastName,
              address1,
              address2: address2 ?? null,
              city,
              state,
              postalCode,
              country,
            },
          },
          items: {
            create: (items as CheckoutItem[]).map((item) => {
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

      for (const item of items as CheckoutItem[]) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return Response.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
