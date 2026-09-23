import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

const imageUpdates: Record<string, string> = {
  // Cigars — Wikipedia Commons (stable)
  "cohiba-robusto":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cohiba_S1.jpg/800px-Cohiba_S1.jpg",
  "arturo-fuente-hemingway":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Cigars_and_an_ashtray.jpg/800px-Cigars_and_an_ashtray.jpg",
  "partagas-series-d-4":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Cigars.jpg/800px-Cigars.jpg",

  // Cigarettes — use real CCW product photos
  "marlboro-red":
    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp",
  "camel-blue":
    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Silver-2-sib-card-840bf57646.webp",
  "american-spirit-yellow":
    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Lights-2-sib-card-840bf57646.webp",
  "lucky-strike-original-red":
    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Full-Flavor-2-sib-card-840bf57646.webp",
};

async function main() {
  console.log("Updating product images...\n");

  for (const [slug, newUrl] of Object.entries(imageUpdates)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.log(`  ⚠ Not found: ${slug}`);
      continue;
    }

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: newUrl,
        alt: product.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    console.log(`  ✓ ${product.name}`);
  }

  console.log("\nDone!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
