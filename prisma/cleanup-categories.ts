import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  const slugsToDelete = ["rolling-products", "accessories"];

  for (const slug of slugsToDelete) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      console.log(`Category "${slug}" not found, skipping.`);
      continue;
    }

    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      select: { id: true, name: true },
    });

    console.log(`Deleting ${products.length} products in "${slug}"...`);

    for (const p of products) {
      await prisma.productImage.deleteMany({ where: { productId: p.id } });
      await prisma.orderItem.deleteMany({ where: { productId: p.id } });
      await prisma.review.deleteMany({ where: { productId: p.id } });
      await prisma.product.delete({ where: { id: p.id } });
      console.log(`  ✓ Deleted: ${p.name}`);
    }

    await prisma.category.delete({ where: { id: category.id } });
    console.log(`✓ Deleted category: ${slug}`);
  }

  console.log("\nDone! Rolling Products and Accessories removed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
