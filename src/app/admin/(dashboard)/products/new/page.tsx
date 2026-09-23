import prisma from "@/lib/prisma";
import ProductForm from "../ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Product | Admin" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
