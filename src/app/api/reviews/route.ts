import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return Response.json({ error: "productId required" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reviewerName: true,
      rating: true,
      title: true,
      body: true,
      verified: true,
      helpful: true,
      createdAt: true,
    },
  });

  return Response.json({ reviews });
}

export async function POST(request: NextRequest) {
  try {
    const { productId, reviewerName, rating, title, body } = await request.json();

    if (!productId || !reviewerName || !rating || !body) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });

    const review = await prisma.review.create({
      data: { productId, reviewerName: reviewerName.trim(), rating, title: title?.trim() || null, body: body.trim() },
    });

    // Update denormalized rating fields
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: agg._avg.rating ?? null,
        reviewCount: agg._count.rating,
      },
    });

    return Response.json({ review }, { status: 201 });
  } catch (error) {
    console.error("review POST error:", error);
    return Response.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
