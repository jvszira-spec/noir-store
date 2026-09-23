import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// CCW product images (exact URLs scraped from ccw.delivery)
const I = {
  cco:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Original-2-sib-card-840bf57646.webp",
  ccs:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Classics-Silver-2-sib-card-840bf57646.webp",
  cl:     "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Lights-2-sib-card-840bf57646.webp",
  cf:     "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Full-2-sib-card-840bf57646.webp",
  bbL:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Lights-2-sib-card-840bf57646.webp",
  bbF:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Full-Flavor-2-sib-card-840bf57646.webp",
  bbM:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-BB-Menthol-2-sib-card-840bf57646.webp",
  cgL:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Goose-Light-2-sib-card-840bf57646.webp",
  cgL25:  "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Canadian-Goose-Light-25-Kings-2-sib-card-840bf57646.webp",
  rgF:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Rolled-Gold-Full-Flavor-2-sib-card-840bf57646.webp",
  rgL:    "https://ccw.delivery/wp-content/uploads/2026/09/CCW-Canadian-Cigarette-Wholesale-Rolled-Gold-Light-2-sib-card-840bf57646.webp",
  rgM:    "https://ccw.delivery/wp-content/uploads/2026/05/CCW-Canadian-Cigarette-Wholesale-Rolled-Gold-Menthol-2-sib-card-840bf57646.webp",
  sel:    "https://ccw.delivery/wp-content/uploads/2026/06/CCW-Canadian-Cigarette-Wholesale-Select-Full-Flavour-2-sib-card-840bf57646.webp",
  ykB:    "https://ccw.delivery/wp-content/uploads/2026/08/CCW-Canadian-Cigarette-Wholesale-Yellowstone-Black-2-1-sib-card-840bf57646.webp",
};

const products = [
  // ─── $5.50 tier ───
  { code:"SG",              name:"SG 20 Pack",                         brand:"SG",               price:5.50,  img:I.sel  },
  { code:"SHD-FULL",        name:"SHD Full 20 Pack",                   brand:"SHD",              price:5.50,  img:I.rgF  },
  { code:"ED",              name:"Export Dark 20 Pack",                brand:"Export",           price:5.50,  img:I.bbF  },
  { code:"FF-B",            name:"Full Flavour Blue 20 Pack",          brand:"FF",               price:5.50,  img:I.bbF  },
  { code:"FL",              name:"Full Light 20 Pack",                 brand:"FL",               price:5.50,  img:I.bbL  },
  { code:"CF",              name:"CF 20 Pack",                         brand:"CF",               price:5.50,  img:I.cf   },
  { code:"CL",              name:"Canadian Lights 20 Pack",            brand:"Canadian",         price:5.50,  img:I.cl   },
  { code:"DK",              name:"DK 20 Pack",                         brand:"DK",               price:5.50,  img:I.ykB  },
  { code:"DK-SPECIAL",      name:"DK Special 20 Pack",                 brand:"DK",               price:5.50,  img:I.ykB  },
  { code:"CCS-20",          name:"Canadian Classic Silver 20 Pack",    brand:"Canadian Classic", price:5.50,  img:I.ccs  },
  { code:"CCO",             name:"Canadian Classic Original 20 Pack",  brand:"Canadian Classic", price:5.50,  img:I.cco  },
  { code:"HALF-SG",         name:"Half SG 20 Pack",                    brand:"SG",               price:5.50,  img:I.sel  },
  { code:"20-CM",           name:"CM 20 Pack",                         brand:"CM",               price:5.50,  img:I.rgF  },
  { code:"TIME-SMOKE",      name:"Time Smoke 20 Pack",                 brand:"Time",             price:5.50,  img:I.bbM  },
  { code:"LDSB",            name:"LD Special Blue 20 Pack",            brand:"LD",               price:5.50,  img:I.rgL  },
  { code:"LD-B",            name:"LD Blue 20 Pack",                    brand:"LD",               price:5.50,  img:I.bbL  },
  // ─── $5.99 tier ───
  { code:"BELMONT",         name:"Belmont 20 Pack",                    brand:"Belmont",          price:5.99,  img:I.sel  },
  { code:"JPR",             name:"John Player Regular 20 Pack",        brand:"John Player",      price:5.99,  img:I.rgF  },
  { code:"JPS",             name:"John Player Special 20 Pack",        brand:"John Player",      price:5.99,  img:I.rgF  },
  { code:"PMS",             name:"Player's Medium Smooth 20 Pack",     brand:"Player's",         price:5.99,  img:I.ccs  },
  { code:"PMF",             name:"Player's Medium Full 20 Pack",       brand:"Player's",         price:5.99,  img:I.cco  },
  { code:"DU-S",            name:"Du Maurier Special 20 Pack",         brand:"Du Maurier",       price:5.99,  img:I.ccs  },
  { code:"NO7-S",           name:"Number 7 Smooth 20 Pack",            brand:"No.7",             price:5.99,  img:I.bbL  },
  { code:"NEXT-O",          name:"Next Original 20 Pack",              brand:"Next",             price:5.99,  img:I.bbF  },
  { code:"NEXT-EXTRA",      name:"Next Extra 20 Pack",                 brand:"Next",             price:5.99,  img:I.bbF  },
  { code:"DISCOUNT",        name:"Discount 20 Pack",                   brand:"Discount",         price:4.99,  img:I.bbL  },
  { code:"NO7-O",           name:"Number 7 Original 20 Pack",         brand:"No.7",             price:5.99,  img:I.bbF  },
  { code:"EXTRA-SMOOTH",    name:"Extra Smooth 20 Pack",               brand:"Extra",            price:5.99,  img:I.ccs  },
  { code:"EXPORT-SMOOTH",   name:"Export Smooth 20 Pack",              brand:"Export",           price:5.99,  img:I.rgL  },
  { code:"PLAYER-FAIR",     name:"Player's Fair 20 Pack",              brand:"Player's",         price:5.99,  img:I.sel  },
  { code:"WPM",             name:"WPM 20 Pack",                        brand:"WPM",              price:5.99,  img:I.bbF  },
  { code:"NEXT-7-O",        name:"Next 7 Original 20 Pack",            brand:"Next",             price:5.99,  img:I.bbF  },
  { code:"PRE-ROLL",        name:"Pre Roll 20 Pack",                   brand:"Pre Roll",         price:5.99,  img:I.rgM  },
  { code:"NEXT-7-S",        name:"Next 7 Smooth 20 Pack",              brand:"Next",             price:5.99,  img:I.ccs  },
  { code:"LDSB-20",         name:"LD Special Blue 20 Pack (Box)",      brand:"LD",               price:5.99,  img:I.rgL  },
  { code:"NEXT-SELECT",     name:"Next Select 20 Pack",                brand:"Next",             price:5.99,  img:I.sel  },
  { code:"JPR-20",          name:"John Player Regular 20 Pack (Box)",  brand:"John Player",      price:5.99,  img:I.rgF  },
  { code:"CCC",             name:"Canadian Classic Charcoal 20 Pack",  brand:"Canadian Classic", price:5.99,  img:I.ykB  },
  { code:"CCG",             name:"Canadian Classic Gold 20 Pack",      brand:"Canadian Classic", price:5.99,  img:I.cgL  },
  { code:"CCTS",            name:"Canadian Classic Triple Smooth 20 Pack", brand:"Canadian Classic", price:5.99, img:I.ccs },
  { code:"FM",              name:"FM 20 Pack",                         brand:"FM",               price:5.99,  img:I.bbF  },
  // ─── 25-pack tier ───
  { code:"PM-S25",          name:"Player's Medium Smooth 25 Pack",     brand:"Player's",         price:6.99,  img:I.ccs  },
  { code:"CF-25",           name:"CF 25 Pack",                         brand:"CF",               price:6.99,  img:I.cf   },
  { code:"CL-25",           name:"Canadian Lights 25 Pack",            brand:"Canadian",         price:6.99,  img:I.cgL25 },
  { code:"BELMONT-25",      name:"Belmont 25 Pack",                    brand:"Belmont",          price:6.99,  img:I.sel  },
  // ─── value / carton pricing ───
  { code:"CCO-25-15",       name:"Canadian Classic Original 25 Pack",  brand:"Canadian Classic", price:15.00, img:I.cco  },
  { code:"CCO-20",          name:"Canadian Classic Original — $20",    brand:"Canadian Classic", price:20.00, img:I.cco  },
  { code:"CCO-25",          name:"Canadian Classic Original — $25",    brand:"Canadian Classic", price:25.00, img:I.cco  },
  { code:"CCO-25-5",        name:"Canadian Classic Original — $5",     brand:"Canadian Classic", price:5.00,  img:I.cco  },
];

function toSlug(code: string) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  console.log("🌱 Importing stock products...\n");

  // Get cigarettes category
  const cat = await prisma.category.findUnique({ where: { slug: "cigarettes" } });
  if (!cat) {
    console.error("❌ 'cigarettes' category not found. Run the main seed first: npx tsx prisma/seed.ts");
    process.exit(1);
  }

  let created = 0, updated = 0, skipped = 0;

  for (const p of products) {
    const slug = toSlug(p.code);
    const sku = p.code.toUpperCase();

    const existing = await prisma.product.findUnique({ where: { slug } });

    if (existing) {
      // Update price and image
      await prisma.product.update({
        where: { slug },
        data: { price: p.price, name: p.name, brand: p.brand, status: "ACTIVE" },
      });
      // Update image if exists
      await prisma.productImage.updateMany({
        where: { productId: existing.id },
        data: { url: p.img, alt: p.name },
      });
      updated++;
    } else {
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug,
          brand: p.brand,
          sku,
          shortDescription: `${p.name} — Canadian cigarettes.`,
          description: `${p.name}. Pack of cigarettes. For adults 19+ only.`,
          price: p.price,
          inventory: 100,
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

    console.log(`  ✓ ${p.name} — $${p.price.toFixed(2)}`);
  }

  console.log(`\n✅ Done! Created: ${created}  Updated: ${updated}  Skipped: ${skipped}`);
  console.log(`   Total products in store: ${await prisma.product.count({ where: { status: "ACTIVE" } })}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
