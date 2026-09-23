import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const REVIEWS: { brandContains: string; reviews: { reviewerName: string; rating: number; title: string; body: string; verified: boolean; helpful: number }[] }[] = [
  {
    brandContains: "Canadian Classic",
    reviews: [
      { reviewerName: "Mike T.", rating: 5, title: "Best cigarette in Canada, period.", body: "Been smoking Canadian Classic for over 20 years. Consistent quality, smooth draw, and the price on NOIR is unbeatable. Arrived in 4 days, perfectly packaged.", verified: true, helpful: 12 },
      { reviewerName: "Darren W.", rating: 4, title: "Great product, solid price", body: "Good quality as always. Packaging arrived in perfect condition. Will definitely order again from NOIR — easy site to use and fast checkout.", verified: true, helpful: 5 },
      { reviewerName: "James L.", rating: 5, title: "Smooth and consistent every time", body: "My go-to brand. NOIR had them in stock when my local shop didn't. Really happy with the service, price, and the quick delivery.", verified: false, helpful: 3 },
    ],
  },
  {
    brandContains: "Canadian",
    reviews: [
      { reviewerName: "Rick S.", rating: 4, title: "Good Canadian brand", body: "Smooth taste, consistent quality. Been buying Canadian for years and NOIR has the best carton price online. Delivery was about 5 days.", verified: true, helpful: 7 },
      { reviewerName: "Paul M.", rating: 5, title: "Always reliable", body: "Fast shipping, well packaged. The quality is exactly what I expect from the Canadian brand. Ordered a full carton and saved a lot compared to the store.", verified: true, helpful: 4 },
    ],
  },
  {
    brandContains: "Du Maurier",
    reviews: [
      { reviewerName: "Sarah M.", rating: 5, title: "Classic Canadian brand — highly recommend", body: "Du Maurier never disappoints. Smooth, reliable, great value for the carton price. NOIR is my new go-to online smoke shop. Fast delivery and secure packaging.", verified: true, helpful: 8 },
      { reviewerName: "Pete G.", rating: 4, title: "Good product, solid service", body: "The product is excellent quality as always. Arrived well packaged in about 6 days. Price per carton here beats my local supplier.", verified: true, helpful: 2 },
      { reviewerName: "Linda B.", rating: 5, title: "Best price I've found online", body: "Ordered 2 cartons, both arrived together in perfect condition. NOIR beats every other site on price. Will keep ordering here.", verified: true, helpful: 6 },
    ],
  },
  {
    brandContains: "Player",
    reviews: [
      { reviewerName: "Kevin B.", rating: 5, title: "Old faithful! Great price.", body: "Player's has been my brand for years. NOIR has the best carton price I've seen online — way better than what I was paying locally. Arrived fast.", verified: true, helpful: 7 },
      { reviewerName: "Tom R.", rating: 3, title: "Product fine, delivery was a couple days late", body: "The cigarettes are the usual great quality. Order arrived a couple days later than expected but customer service was responsive.", verified: false, helpful: 1 },
      { reviewerName: "Angela D.", rating: 5, title: "Exactly what I ordered, fast delivery", body: "Fast delivery, well packaged, authentic product. NOIR is reliable and prices are very competitive. Already placed a second order.", verified: true, helpful: 4 },
    ],
  },
  {
    brandContains: "Belmont",
    reviews: [
      { reviewerName: "Chris N.", rating: 5, title: "Perfect as always", body: "Belmont Milds are my brand and NOIR always has them available. Carton price saves me a lot vs the corner store. Really happy customer here.", verified: true, helpful: 6 },
      { reviewerName: "Donna H.", rating: 4, title: "Great quality, arrived quickly", body: "Arrived in 4 days, sealed perfectly, exactly as advertised. Good price, I'll be a repeat customer for sure.", verified: true, helpful: 3 },
    ],
  },
  {
    brandContains: "Export",
    reviews: [
      { reviewerName: "Bill C.", rating: 5, title: "Export A — a Canadian classic", body: "Export A has been around forever and for good reason. Smooth, consistent, and a great price at NOIR. Fast delivery and solid packaging on the carton.", verified: true, helpful: 11 },
      { reviewerName: "Ray M.", rating: 4, title: "Good price, good service", body: "Ordered two cartons — both arrived together in great shape. The price per carton here beats my local supplier. Will keep coming back.", verified: true, helpful: 4 },
    ],
  },
  {
    brandContains: "John Player",
    reviews: [
      { reviewerName: "Eric P.", rating: 4, title: "Solid brand, fair price", body: "John Player Special is a great smoke. NOIR had it in stock and the price was better than I expected. Arrived well packaged.", verified: true, helpful: 3 },
      { reviewerName: "Marty F.", rating: 5, title: "Fast shipping, great product", body: "Ordered Monday, arrived Friday. NOIR is legit — great price, quick delivery, product exactly as described. Will order again.", verified: true, helpful: 5 },
    ],
  },
  {
    brandContains: "LD",
    reviews: [
      { reviewerName: "Steve A.", rating: 5, title: "Best value cigarette online", body: "LD is already a good value cigarette and NOIR makes it even better with their carton price. Arrived in 5 days, well packaged, happy customer.", verified: true, helpful: 8 },
      { reviewerName: "Cam R.", rating: 4, title: "Reliable product, good service", body: "Good quality as always. NOIR has a smooth checkout and the product arrived sealed and perfect. Saved about $15 compared to buying locally.", verified: false, helpful: 2 },
    ],
  },
  {
    brandContains: "Select",
    reviews: [
      { reviewerName: "Nicole H.", rating: 4, title: "Good carton price", body: "Always buy Select cartons when I can find a deal. NOIR had the best price. Took about 6 days to arrive but everything was in perfect condition.", verified: true, helpful: 3 },
      { reviewerName: "Bob D.", rating: 5, title: "Smooth smoke, fast delivery", body: "Select Full Flavour is consistent and smooth. Carton price at NOIR is very fair. Easy to order, fast to arrive.", verified: true, helpful: 4 },
    ],
  },
  {
    brandContains: "Eclipse",
    reviews: [
      { reviewerName: "Jay K.", rating: 5, title: "Great value cigarette", body: "Eclipse is underrated. Smooth taste, good price per pack. Bought a carton here and saved a lot. Delivery was quick and secure.", verified: true, helpful: 6 },
    ],
  },
  {
    brandContains: "Yellowstone",
    reviews: [
      { reviewerName: "Frank O.", rating: 4, title: "Good budget option", body: "Yellowstone is a solid budget cigarette. NOIR had a great carton deal and it arrived in 5 days. No complaints — will buy again.", verified: false, helpful: 2 },
      { reviewerName: "Heather V.", rating: 5, title: "Always consistent", body: "I always come back to Yellowstone. Smooth, satisfying, and affordable. NOIR's price on the carton is hard to beat. Fast delivery too.", verified: true, helpful: 7 },
    ],
  },
  {
    brandContains: "BC Kings",
    reviews: [
      { reviewerName: "Dave M.", rating: 5, title: "BC local favourite", body: "BC Kings is a West Coast staple. Got a carton here for a great price. Shipping took 5 days but was well packaged. Really satisfied.", verified: true, helpful: 9 },
    ],
  },
  {
    brandContains: "No.7",
    reviews: [
      { reviewerName: "Karen S.", rating: 4, title: "Good smooth smoke", body: "Number 7 is reliably smooth. Good price on NOIR. Delivery was fast and the carton arrived sealed and undamaged. Very happy.", verified: true, helpful: 3 },
    ],
  },
  {
    brandContains: "Nexus",
    reviews: [
      { reviewerName: "Dan L.", rating: 5, title: "Great price, underrated brand", body: "Nexus doesn't get the credit it deserves. Smooth, affordable, and NOIR has the best price online. Will definitely be ordering again.", verified: true, helpful: 5 },
    ],
  },
];

async function main() {
  console.log("Clearing old reviews and reseeding...");
  await prisma.review.deleteMany({});
  await prisma.product.updateMany({ data: { avgRating: null, reviewCount: 0 } });

  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, brand: true, name: true },
  });

  let totalCreated = 0;

  for (const group of REVIEWS) {
    const matching = products.filter((p) =>
      (p.brand ?? "").toLowerCase().includes(group.brandContains.toLowerCase()) ||
      p.name.toLowerCase().includes(group.brandContains.toLowerCase())
    );

    if (matching.length === 0) {
      console.log(`  No products for "${group.brandContains}" — skipping`);
      continue;
    }

    for (let i = 0; i < group.reviews.length; i++) {
      const product = matching[i % matching.length];
      const review = group.reviews[i];
      await prisma.review.create({
        data: {
          productId: product.id,
          reviewerName: review.reviewerName,
          rating: review.rating,
          title: review.title,
          body: review.body,
          verified: review.verified,
          helpful: review.helpful,
        },
      });
      totalCreated++;
    }

    // Update denormalized rating for each matched product
    for (const product of matching) {
      const agg = await prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true },
        _count: { rating: true },
      });
      if (agg._count.rating > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { avgRating: agg._avg.rating, reviewCount: agg._count.rating },
        });
      }
    }
  }

  console.log(`✅ Seeded ${totalCreated} reviews across matching products`);
}

main()
  .catch(console.error)
  .finally(() => (prisma as { $disconnect?: () => Promise<void> }).$disconnect?.());
