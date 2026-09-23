import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return Response.json({ categories });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const slug = body.slug || slugify(body.name);
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description ?? null,
        image: body.image ?? null,
        visible: body.visible ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return Response.json({ category }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Create failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
