import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
  return {
    title: `Shop ${name}`,
    description: `Browse our collection of premium ${name.toLowerCase()}.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams({ ...sp, category }).toString();
  redirect(`/shop?${qs}`);
}
