import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "12");

  if (!q) {
    return Response.json({ products: [], total: 0 });
  }

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: limit,
  });

  return Response.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: parseFloat(String(p.price)),
      slug: p.slug,
      image: p.images[0]?.url ?? null,
    })),
    total: products.length,
  });
}
