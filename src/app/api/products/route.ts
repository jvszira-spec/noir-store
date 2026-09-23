import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (featured === "true") where.featured = true;

  const products = await prisma.product.findMany({
    where,
    include: { images: true, category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ products });
}
