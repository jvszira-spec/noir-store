import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: "asc" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });
  for (const p of products) {
    console.log(`${p.name} | ${p.images[0]?.url ?? "NO IMAGE"}`);
  }
}
main().catch(console.error).finally(() => (prisma as any).$disconnect?.());
