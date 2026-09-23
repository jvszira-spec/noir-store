import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

// Unsplash images for cigarette packs (work everywhere, no hotlink protection)
const cigImages = [
  "https://images.unsplash.com/photo-1544164559-2e6f48c22e9c?w=600&q=80",
  "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=600&q=80",
  "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80",
  "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80",
  "https://images.unsplash.com/photo-1565898001836-eddfd0c9c8d5?w=600&q=80",
];

async function main() {
  // Fix all products that use ccw.delivery images
  const products = await prisma.product.findMany({
    include: { images: true },
  });

  let fixed = 0;
  for (const p of products) {
    const hasCcw = p.images.some((img) => img.url.includes("ccw.delivery"));
    if (!hasCcw) continue;

    const newUrl = cigImages[fixed % cigImages.length];
    await prisma.productImage.deleteMany({ where: { productId: p.id } });
    await prisma.productImage.create({
      data: { productId: p.id, url: newUrl, alt: p.name, isPrimary: true, sortOrder: 0 },
    });
    fixed++;
  }

  console.log(`Fixed ${fixed} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
