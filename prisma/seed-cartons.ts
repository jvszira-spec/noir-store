import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BASE = "https://ccw.delivery/wp-content/uploads/";

// All 22 carton images from CCW (exact URLs)
const cartonImgs = {
  nexusLight:         BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Nexus-Light-1-sib-card-840bf57646.webp",
  playfareMenthol:    BASE + "2026/07/CCW-Canadian-Cigarette-Wholesale-PlayFares-Menthol-Premium-1-sib-card-840bf57646.webp",
  playFareUltra:      BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-PlayFares-Ultra-Light-Premium-1-sib-card-840bf57646.webp",
  canadianUltra:      BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Ultra-Lights-Premium-1-sib-card-840bf57646.webp",
  canadianCharcoal:   BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Charcoal-1-sib-card-840bf57646.webp",
  selectFF:           BASE + "2026/06/CCW-Canadian-Cigarette-Wholesale-Select-Full-Flavour-1-sib-card-840bf57646.webp",
  selectLight:        BASE + "2026/06/CCW-Canadian-Cigarette-Wholesale-Select-Light-1-sib-card-840bf57646.webp",
  selectMenthol:      BASE + "2026/06/CCW-Canadian-Cigarette-Wholesale-Select-Menthol-1-sib-card-840bf57646.webp",
  selectSpecial:      BASE + "2026/06/CCW-Canadian-Cigarette-Wholesale-Select-Special-1-sib-card-840bf57646.webp",
  eclipseFF:          BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Eclipse-Full-Flavour-1-1-sib-card-840bf57646.webp",
  eclipseLight:       BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Eclipse-Lights-1-1-sib-card-840bf57646.webp",
  eclipseMenthol:     BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Eclipse-Menthol-1-1-sib-card-840bf57646.webp",
  yellowstoneFF:      BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Yellowstone-Full-Flavour-1-sib-card-840bf57646.webp",
  yellowstoneLight:   BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Yellowstone-Light-1-sib-card-840bf57646.webp",
  yellowstoneMenthol: BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Yellowstone-Menthol-1-sib-card-840bf57646.webp",
  yellowstoneSpecial: BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-Yellowstone-Special-1-sib-card-840bf57646.webp",
  yellowstoneBlack:   BASE + "2026/08/CCW-Canadian-Cigarette-Wholesale-Yellowstone-Black-1-sib-card-840bf57646.webp",
  bcKingsGold:        BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-BC-Kings-Gold-1-sib-card-840bf57646.webp",
  bcKingsLight:       BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-BC-Kings-Light-1-sib-card-840bf57646.webp",
  bcKingsMenthol:     BASE + "2026/06/CCW-Canadian-Cigarette-Wholesale-BC-Kings-Menthol-1-sib-card-840bf57646.webp",
  bcKingsFF:          BASE + "2026/06/CCW-Canadian-Cigarette-Wholesale-BC-Kings-Full-Flavour-1-sib-card-840bf57646.webp",
  bcKingsCharcoal:    BASE + "2026/05/CCW-Canadian-Cigarette-Wholesale-BC-Kings-Charcoal-1-sib-card-840bf57646.webp",
};

// Default fallback image for unmatched cartons
const fallback = cartonImgs.selectFF;

const cartons = [
  // ─── 22 CCW top-tier cartons (exact from site) ───
  { name:"Top-Tier Nexus Light Carton",           slug:"carton-nexus-light",         brand:"Nexus",          price:45, img:cartonImgs.nexusLight },
  { name:"Top-Tier Playfare Menthol Carton",       slug:"carton-playfare-menthol",    brand:"Playfare",       price:45, img:cartonImgs.playfareMenthol },
  { name:"Top-Tier Playfare Ultra Lights Carton",  slug:"carton-playfare-ultra",      brand:"Playfare",       price:45, img:cartonImgs.playFareUltra },
  { name:"Top-Tier Canadian Ultra Lights Carton",  slug:"carton-canadian-ultra",      brand:"Canadian",       price:45, img:cartonImgs.canadianUltra },
  { name:"Top-Tier Canadian Charcoal Carton",      slug:"carton-canadian-charcoal",   brand:"Canadian",       price:45, img:cartonImgs.canadianCharcoal },
  { name:"Select Full Flavour Carton",             slug:"carton-select-ff",           brand:"Select",         price:45, img:cartonImgs.selectFF },
  { name:"Select Lights Carton",                   slug:"carton-select-light",        brand:"Select",         price:45, img:cartonImgs.selectLight },
  { name:"Select Menthol Carton",                  slug:"carton-select-menthol",      brand:"Select",         price:45, img:cartonImgs.selectMenthol },
  { name:"Select Special Carton",                  slug:"carton-select-special",      brand:"Select",         price:45, img:cartonImgs.selectSpecial },
  { name:"Eclipse Full Flavour Carton",            slug:"carton-eclipse-ff",          brand:"Eclipse",        price:45, img:cartonImgs.eclipseFF },
  { name:"Eclipse Lights Carton",                  slug:"carton-eclipse-light",       brand:"Eclipse",        price:45, img:cartonImgs.eclipseLight },
  { name:"Eclipse Menthol Carton",                 slug:"carton-eclipse-menthol",     brand:"Eclipse",        price:45, img:cartonImgs.eclipseMenthol },
  { name:"Yellowstone Full Flavour Carton",        slug:"carton-yellowstone-ff",      brand:"Yellowstone",    price:45, img:cartonImgs.yellowstoneFF },
  { name:"Yellowstone Light Carton",               slug:"carton-yellowstone-light",   brand:"Yellowstone",    price:45, img:cartonImgs.yellowstoneLight },
  { name:"Yellowstone Menthol Carton",             slug:"carton-yellowstone-menthol", brand:"Yellowstone",    price:45, img:cartonImgs.yellowstoneMenthol },
  { name:"Yellowstone Special Carton",             slug:"carton-yellowstone-special", brand:"Yellowstone",    price:45, img:cartonImgs.yellowstoneSpecial },
  { name:"Yellowstone Black Carton",               slug:"carton-yellowstone-black",   brand:"Yellowstone",    price:45, img:cartonImgs.yellowstoneBlack },
  { name:"BC Kings Gold Carton",                   slug:"carton-bc-kings-gold",       brand:"BC Kings",       price:45, img:cartonImgs.bcKingsGold },
  { name:"BC Kings Light Carton",                  slug:"carton-bc-kings-light",      brand:"BC Kings",       price:45, img:cartonImgs.bcKingsLight },
  { name:"BC Kings Menthol Carton",                slug:"carton-bc-kings-menthol",    brand:"BC Kings",       price:45, img:cartonImgs.bcKingsMenthol },
  { name:"BC Kings Full Flavour Carton",           slug:"carton-bc-kings-ff",         brand:"BC Kings",       price:45, img:cartonImgs.bcKingsFF },
  { name:"BC Kings Charcoal Carton",               slug:"carton-bc-kings-charcoal",   brand:"BC Kings",       price:45, img:cartonImgs.bcKingsCharcoal },

  // ─── Carton versions of user's pack stock ───
  { name:"SG Carton (10 Packs)",                   slug:"carton-sg",                  brand:"SG",             price:50, img:cartonImgs.selectFF },
  { name:"SHD Full Carton (10 Packs)",             slug:"carton-shd-full",            brand:"SHD",            price:50, img:cartonImgs.eclipseFF },
  { name:"CF Carton (10 Packs)",                   slug:"carton-cf",                  brand:"CF",             price:50, img:cartonImgs.canadianCharcoal },
  { name:"Canadian Lights Carton (10 Packs)",      slug:"carton-cl",                  brand:"Canadian",       price:50, img:cartonImgs.canadianUltra },
  { name:"DK Carton (10 Packs)",                   slug:"carton-dk",                  brand:"DK",             price:50, img:cartonImgs.yellowstoneBlack },
  { name:"Canadian Classic Silver Carton",         slug:"carton-ccs",                 brand:"Canadian Classic",price:50, img:cartonImgs.canadianCharcoal },
  { name:"Canadian Classic Original Carton",       slug:"carton-cco",                 brand:"Canadian Classic",price:50, img:cartonImgs.canadianCharcoal },
  { name:"LD Special Blue Carton (10 Packs)",      slug:"carton-ldsb",                brand:"LD",             price:50, img:cartonImgs.eclipseLight },
  { name:"LD Blue Carton (10 Packs)",              slug:"carton-ld-b",                brand:"LD",             price:50, img:cartonImgs.eclipseLight },
  { name:"Belmont Carton (10 Packs)",              slug:"carton-belmont",             brand:"Belmont",        price:55, img:cartonImgs.selectSpecial },
  { name:"John Player Regular Carton",             slug:"carton-jpr",                 brand:"John Player",    price:55, img:cartonImgs.bcKingsFF },
  { name:"John Player Special Carton",             slug:"carton-jps",                 brand:"John Player",    price:55, img:cartonImgs.bcKingsFF },
  { name:"Player's Medium Smooth Carton",          slug:"carton-pms",                 brand:"Player's",       price:55, img:cartonImgs.selectLight },
  { name:"Player's Medium Full Carton",            slug:"carton-pmf",                 brand:"Player's",       price:55, img:cartonImgs.selectFF },
  { name:"Du Maurier Special Carton",              slug:"carton-du-s",                brand:"Du Maurier",     price:55, img:cartonImgs.selectSpecial },
  { name:"Number 7 Smooth Carton",                 slug:"carton-no7-s",               brand:"No.7",           price:55, img:cartonImgs.eclipseLight },
  { name:"Number 7 Original Carton",               slug:"carton-no7-o",               brand:"No.7",           price:55, img:cartonImgs.eclipseFF },
  { name:"Next Original Carton (10 Packs)",        slug:"carton-next-o",              brand:"Next",           price:55, img:cartonImgs.selectFF },
  { name:"Next Extra Carton (10 Packs)",           slug:"carton-next-extra",          brand:"Next",           price:55, img:cartonImgs.eclipseFF },
  { name:"Next 7 Original Carton",                 slug:"carton-next-7-o",            brand:"Next",           price:55, img:cartonImgs.selectFF },
  { name:"Next 7 Smooth Carton",                   slug:"carton-next-7-s",            brand:"Next",           price:55, img:cartonImgs.selectLight },
  { name:"Next Select Carton",                     slug:"carton-next-select",         brand:"Next",           price:55, img:cartonImgs.selectSpecial },
  { name:"Export Smooth Carton (10 Packs)",        slug:"carton-export-smooth",       brand:"Export",         price:55, img:cartonImgs.eclipseLight },
  { name:"Canadian Classic Charcoal Carton",       slug:"carton-ccc",                 brand:"Canadian Classic",price:55, img:cartonImgs.canadianCharcoal },
  { name:"Canadian Classic Gold Carton",           slug:"carton-ccg",                 brand:"Canadian Classic",price:55, img:cartonImgs.bcKingsGold },
  { name:"Canadian Classic Triple Smooth Carton",  slug:"carton-ccts",                brand:"Canadian Classic",price:55, img:cartonImgs.selectLight },
  { name:"Player's Medium Smooth 25-Pack Carton",  slug:"carton-pm-s25",              brand:"Player's",       price:60, img:cartonImgs.selectLight },
  { name:"Canadian Lights 25-Pack Carton",         slug:"carton-cl-25",               brand:"Canadian",       price:60, img:cartonImgs.canadianUltra },
  { name:"Belmont 25-Pack Carton",                 slug:"carton-belmont-25",          brand:"Belmont",        price:60, img:cartonImgs.selectSpecial },
];

async function main() {
  console.log("🌱 Importing carton products...\n");

  // Get or create "cartons" category
  const cat = await prisma.category.upsert({
    where: { slug: "cartons" },
    update: { name: "Cigarette Cartons", visible: true },
    create: {
      name: "Cigarette Cartons",
      slug: "cartons",
      description: "Full cartons — 10 packs per carton. Best value.",
      image: "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Select-Full-Flavour-1-sib-card-840bf57646.webp",
      sortOrder: 1,
      visible: true,
    },
  });
  console.log(`✓ Category: ${cat.name} (id: ${cat.id})\n`);

  let created = 0, updated = 0;

  for (const p of cartons) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });

    if (existing) {
      await prisma.product.update({
        where: { slug: p.slug },
        data: { price: p.price, name: p.name, brand: p.brand, status: "ACTIVE" },
      });
      await prisma.productImage.updateMany({
        where: { productId: existing.id },
        data: { url: p.img, alt: p.name },
      });
      updated++;
    } else {
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          brand: p.brand,
          sku: p.slug.toUpperCase(),
          shortDescription: `${p.name} — 10 packs per carton.`,
          description: `${p.name}. Full carton of 10 packs. For adults 19+ only.`,
          price: p.price,
          inventory: 50,
          categoryId: cat.id,
          featured: false,
          status: "ACTIVE",
        },
      });
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.img,
          isPrimary: true,
          sortOrder: 0,
          alt: p.name,
        },
      });
      created++;
    }
    console.log(`  ✓ ${p.name} — $${p.price}`);
  }

  console.log(`\n✅ Done! Created: ${created}  Updated: ${updated}`);
  console.log(`   Total cartons in store: ${await prisma.product.count({ where: { categoryId: cat.id } })}`);
  console.log(`   Total ALL products: ${await prisma.product.count({ where: { status: "ACTIVE" } })}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
