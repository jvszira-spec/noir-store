import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product | Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light">Edit Product</h1>
          <p className="text-[#6A6560] text-sm mt-1">{product.name}</p>
        </div>
        <a
          href={`/product/${product.slug}`}
          target="_blank"
          className="text-[10px] tracking-[0.1em] text-[#6A6560] hover:text-[#C9A96E] transition-colors border border-[#2A2A2A] px-3 py-1.5"
        >
          VIEW ON STORE ↗
        </a>
      </div>
      <ProductForm
        categories={categories}
        productId={product.id}
        defaultValues={{
          name: product.name,
          brand: product.brand ?? "",
          sku: product.sku ?? "",
          description: product.description ?? "",
          shortDescription: product.shortDescription ?? "",
          price: String(product.price),
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
          inventory: String(product.inventory),
          lowStockThreshold: String(product.lowStockThreshold),
          categoryId: product.categoryId ?? "",
          status: product.status,
          featured: product.featured,
        }}
        defaultImages={product.images}
      />
    </div>
  );
}
