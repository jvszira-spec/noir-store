import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.category.update({
    where: { slug: "cigarettes" },
    data: { image: "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp" },
  });
  console.log("✓ Cigarettes image set");

  await prisma.category.update({
    where: { slug: "cigars" },
    data: { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cohiba_S1.jpg/400px-Cohiba_S1.jpg" },
  });
  console.log("✓ Cigars image set");
}

main().catch(console.error).finally(() => prisma.$disconnect());
