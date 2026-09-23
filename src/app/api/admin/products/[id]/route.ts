import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
  });
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) {
      data.name = body.name;
      data.slug = body.slug || slugify(body.name);
    }
    if (body.description !== undefined) data.description = body.description;
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.brand !== undefined) data.brand = body.brand;
    if (body.sku !== undefined) data.sku = body.sku;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.compareAtPrice !== undefined)
      data.compareAtPrice = body.compareAtPrice ? parseFloat(body.compareAtPrice) : null;
    if (body.inventory !== undefined) data.inventory = parseInt(body.inventory);
    if (body.lowStockThreshold !== undefined) data.lowStockThreshold = parseInt(body.lowStockThreshold);
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
    if (body.featured !== undefined) data.featured = body.featured;
    if (body.status !== undefined) data.status = body.status;

    const product = await prisma.product.update({ where: { id }, data });
    return Response.json({ product });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return Response.json({ success: true });
}
