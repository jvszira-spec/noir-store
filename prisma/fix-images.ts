import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Working CCW images for cigarette packs
const WORKING = {
  cig_red:   "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp",
  cig_silver:"https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Silver-2-sib-card-840bf57646.webp",
  cig_light: "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Lights-2-sib-card-840bf57646.webp",
  cig_blue:  "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Lights-2-sib-card-840bf57646.webp",
  cig_dark:  "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Full-Flavor-2-sib-card-840bf57646.webp",
  cig_menthol:"https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Menthol-2-sib-card-840bf57646.webp",
};

// Map broken Unsplash IDs to working replacements
const REPLACEMENTS: Record<string, string> = {
  "photo-1544164559-2e6f48c22e9c": WORKING.cig_red,       // was red cigarette pack
  "photo-1565898001836-eddfd0c9c8d5": WORKING.cig_dark,    // was cigar
  "photo-1474631245212-32dc3c8310c6": WORKING.cig_silver,  // was lighter/smoke
};

async function main() {
  const images = await prisma.productImage.findMany({
    where: { url: { contains: "unsplash.com" } },
    select: { id: true, url: true, productId: true },
  });

  console.log(`Found ${images.length} Unsplash image(s) to check`);

  let updated = 0;
  for (const img of images) {
    const match = Object.entries(REPLACEMENTS).find(([badId]) => img.url.includes(badId));
    if (match) {
      const [badId, newUrl] = match;
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: newUrl },
      });
      console.log(`✅ Fixed: ...${badId}... → ccw.delivery`);
      updated++;
    }
  }

  // Also fix category images
  const cats = await prisma.category.findMany({
    where: { image: { contains: "unsplash.com" } },
  });
  for (const cat of cats) {
    const match = Object.entries(REPLACEMENTS).find(([badId]) => cat.image?.includes(badId));
    if (match) {
      const [badId, newUrl] = match;
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: newUrl },
      });
      console.log(`✅ Fixed category "${cat.name}": ...${badId}... → ccw.delivery`);
      updated++;
    }
  }

  console.log(`\nDone — ${updated} image(s) updated`);
}

main().catch(console.error).finally(async () => { await (prisma as any).$disconnect?.(); });
