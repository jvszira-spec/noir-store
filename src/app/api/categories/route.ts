import prisma from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  return Response.json({ categories });
}
