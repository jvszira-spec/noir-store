import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@noir-store.com" },
    update: {},
    create: {
      email: "admin@noir-store.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("✓ Admin user created: admin@noir-store.com / admin123");

  // Categories
  const categories = [
    {
      name: "Cigarettes",
      slug: "cigarettes",
      description: "Premium cigarettes from around the world",
      image:
        "https://images.unsplash.com/photo-1544164559-2e6f48c22e9c?w=800&q=80",
      sortOrder: 0,
    },
    {
      name: "Cigars",
      slug: "cigars",
      description: "Hand-rolled premium cigars",
      image:
        "https://images.unsplash.com/photo-1565898001836-eddfd0c9c8d5?w=800&q=80",
      sortOrder: 1,
    },
    {
      name: "Rolling Products",
      slug: "rolling-products",
      description: "Rolling tobacco, papers, and filters",
      image:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80",
      sortOrder: 2,
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Lighters, cases, ashtrays, and more",
      image:
        "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=800&q=80",
      sortOrder: 3,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
    console.log(`✓ Category: ${cat.name}`);
  }

  // Products
  const products = [
    {
      name: "Marlboro Red",
      slug: "marlboro-red",
      brand: "Marlboro",
      sku: "MAR-RED-20",
      shortDescription: "Classic full-flavor cigarettes in a king size pack of 20.",
      description:
        "Marlboro Red is the original full-flavor cigarette that has defined the category for decades. A bold, satisfying smoke with consistent character. Pack of 20.",
      price: 12.99,
      compareAtPrice: null,
      inventory: 150,
      categorySlug: "cigarettes",
      featured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1544164559-2e6f48c22e9c?w=600&q=80",
    },
    {
      name: "Camel Blue",
      slug: "camel-blue",
      brand: "Camel",
      sku: "CAM-BLU-20",
      shortDescription: "Light and smooth with a distinctive camel blend.",
      description:
        "Camel Blue delivers a lighter, smoother experience while maintaining the distinctive Camel character. The iconic blend with a milder profile. Pack of 20.",
      price: 11.99,
      compareAtPrice: null,
      inventory: 120,
      categorySlug: "cigarettes",
      featured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=600&q=80",
    },
    {
      name: "Cohiba Robusto",
      slug: "cohiba-robusto",
      brand: "Cohiba",
      sku: "COH-ROB-1",
      shortDescription: "Premium hand-rolled cigar from the Dominican Republic.",
      description:
        "The Cohiba Robusto is a medium-to-full-bodied cigar with a smooth draw and complex flavor profile. Notes of earth, cedar, and subtle spice make it an exceptional smoke for special occasions. 5 x 50 ring gauge.",
      price: 18.99,
      compareAtPrice: 22.99,
      inventory: 45,
      categorySlug: "cigars",
      featured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1565898001836-eddfd0c9c8d5?w=600&q=80",
    },
    {
      name: "Arturo Fuente Hemingway",
      slug: "arturo-fuente-hemingway",
      brand: "Arturo Fuente",
      sku: "AF-HEM-1",
      shortDescription: "Award-winning medium-bodied perfecto from the Fuente family.",
      description:
        "One of the most celebrated cigars in the world, the Hemingway is a perfecto-shaped masterpiece. Medium-bodied with rich, creamy notes and exceptional consistency. An iconic cigar at any price point.",
      price: 14.99,
      compareAtPrice: null,
      inventory: 30,
      categorySlug: "cigars",
      featured: false,
      imageUrl:
        "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=600&q=80",
    },
    {
      name: "American Spirit Yellow",
      slug: "american-spirit-yellow",
      brand: "Natural American Spirit",
      sku: "NAS-YEL-20",
      shortDescription: "Organic tobacco cigarettes, additive-free.",
      description:
        "Natural American Spirit Yellow delivers a mellow, light smoke from 100% additive-free organic tobacco. Comes in a pack of 20.",
      price: 15.49,
      compareAtPrice: null,
      inventory: 80,
      categorySlug: "cigarettes",
      featured: false,
      imageUrl:
        "https://images.unsplash.com/photo-1544164559-2e6f48c22e9c?w=600&q=80",
    },
    {
      name: "Drum Original Rolling Tobacco",
      slug: "drum-original-rolling-tobacco",
      brand: "Drum",
      sku: "DRM-ORG-50",
      shortDescription: "50g pouch of original Dutch rolling tobacco.",
      description:
        "Drum Original is one of the world's most popular hand-rolling tobaccos. The blend is well-balanced with a warm, slightly sweet character that rolls smoothly. 50g pouch with papers included.",
      price: 22.99,
      compareAtPrice: 26.99,
      inventory: 60,
      categorySlug: "rolling-products",
      featured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80",
    },
    {
      name: "Rizla Rolling Papers — Silver",
      slug: "rizla-silver",
      brand: "Rizla",
      sku: "RIZ-SIL-50",
      shortDescription: "50 ultra-thin silver rolling papers. Original French cut.",
      description:
        "Rizla Silver are ultra-thin rolling papers made from pure flax plant. The standard size is perfect for a single roll and burns evenly without affecting the tobacco taste. Box of 50 leaves.",
      price: 3.49,
      compareAtPrice: null,
      inventory: 200,
      categorySlug: "rolling-products",
      featured: false,
      imageUrl:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80",
    },
    {
      name: "Zippo Brushed Chrome Lighter",
      slug: "zippo-brushed-chrome",
      brand: "Zippo",
      sku: "ZIP-BCH-1",
      shortDescription: "Classic Zippo windproof lighter in brushed chrome finish.",
      description:
        "The Zippo windproof lighter is an American icon. Brushed chrome finish with the signature hinge lid and one-hand operation. Windproof flame, refillable, lifetime guarantee. Made in the USA.",
      price: 24.99,
      compareAtPrice: null,
      inventory: 35,
      categorySlug: "accessories",
      featured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80",
    },
    {
      name: "S.T. Dupont Mini Jet Lighter",
      slug: "st-dupont-mini-jet",
      brand: "S.T. Dupont",
      sku: "STD-MJT-1",
      shortDescription: "Premium single-jet flame lighter in brushed brass.",
      description:
        "The S.T. Dupont Mini Jet is a compact jet flame lighter crafted with the precision and elegance that S.T. Dupont is known for. Windproof single torch, refillable. Brushed brass body.",
      price: 89.99,
      compareAtPrice: 109.99,
      inventory: 12,
      categorySlug: "accessories",
      featured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80",
    },
    {
      name: "Partagas Series D No. 4",
      slug: "partagas-series-d-4",
      brand: "Partagas",
      sku: "PAR-SD4-1",
      shortDescription: "Full-bodied robusto with complex earthy character.",
      description:
        "The Partagas Series D No. 4 is a full-bodied robusto that has earned a devoted following worldwide. Complex flavours of earth, coffee, and dark wood with a rich, satisfying finish. 5 x 50.",
      price: 21.99,
      compareAtPrice: null,
      inventory: 25,
      categorySlug: "cigars",
      featured: false,
      imageUrl:
        "https://images.unsplash.com/photo-1565898001836-eddfd0c9c8d5?w=600&q=80",
    },
    {
      name: "Lucky Strike Original Red",
      slug: "lucky-strike-original-red",
      brand: "Lucky Strike",
      sku: "LKS-RED-20",
      shortDescription: "Toasted full-flavor cigarettes in a pack of 20.",
      description:
        "Lucky Strike's toasting process has been a trademark since 1916. The original red delivers a full, robust flavour with a smooth finish. Pack of 20.",
      price: 11.49,
      compareAtPrice: null,
      inventory: 90,
      categorySlug: "cigarettes",
      featured: false,
      imageUrl:
        "https://images.unsplash.com/photo-1544164559-2e6f48c22e9c?w=600&q=80",
    },
    {
      name: "Hessian Travel Cigar Case",
      slug: "hessian-travel-cigar-case",
      brand: "Hessian",
      sku: "HES-CAS-3",
      shortDescription: "Leather travel case for 3 cigars. Hand-stitched.",
      description:
        "Protect your cigars in transit with this hand-stitched leather case from Hessian. Fits 3 standard-sized cigars. Cedar lining maintains humidity during travel. Available in dark brown.",
      price: 49.99,
      compareAtPrice: 64.99,
      inventory: 18,
      categorySlug: "accessories",
      featured: false,
      imageUrl:
        "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=600&q=80",
    },
  ];

  for (const product of products) {
    const { categorySlug, imageUrl, ...productData } = product;
    const categoryId = createdCategories[categorySlug];

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...productData, categoryId },
      create: { ...productData, categoryId },
    });

    // Add image if no images exist
    const existingImages = await prisma.productImage.count({
      where: { productId: created.id },
    });

    if (existingImages === 0) {
      await prisma.productImage.create({
        data: {
          productId: created.id,
          url: imageUrl,
          isPrimary: true,
          sortOrder: 0,
          alt: product.name,
        },
      });
    }

    console.log(`✓ Product: ${product.name}`);
  }

  // Store settings
  const defaultSettings = [
    { key: "storeName", value: "NOIR" },
    { key: "storeEmail", value: "support@noir-store.com" },
    { key: "announcementBar", value: "PREMIUM COLLECTION · FREE SHIPPING OVER $75 · ADULTS 21+ ONLY" },
    { key: "freeShippingThreshold", value: "75" },
    { key: "currency", value: "USD" },
    { key: "ageVerificationRequired", value: "true" },
  ];

  for (const setting of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Default shipping rules
  const shippingRules = [
    {
      name: "Standard Shipping",
      description: "5–7 business days",
      price: 8.99,
      freeThreshold: 75,
      estimatedDays: "5–7 business days",
      allowedCountries: ["US"],
      active: true,
      sortOrder: 0,
    },
    {
      name: "Express Shipping",
      description: "2–3 business days",
      price: 18.99,
      estimatedDays: "2–3 business days",
      allowedCountries: ["US"],
      active: true,
      sortOrder: 1,
    },
    {
      name: "Overnight",
      description: "Next business day",
      price: 34.99,
      estimatedDays: "Next business day",
      allowedCountries: ["US"],
      active: true,
      sortOrder: 2,
    },
  ];

  for (const rule of shippingRules) {
    await prisma.shippingRule.upsert({
      where: { id: rule.name.toLowerCase().replace(/ /g, "-") },
      update: rule,
      create: { id: rule.name.toLowerCase().replace(/ /g, "-"), ...rule },
    });
  }

  console.log("✓ Shipping rules created");
  console.log("\n✅ Seed complete!");
  console.log("\n📋 Admin credentials:");
  console.log("   Email:    admin@noir-store.com");
  console.log("   Password: admin123");
  console.log("\n⚠️  Change the admin password after first login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
