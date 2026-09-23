import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit, Search } from "lucide-react";

interface SearchParams {
  q?: string;
  status?: string;
  page?: string;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const limit = 20;
  const q = params.q ?? "";
  const status = params.status;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-light">Products</h1>
          <p className="text-[#6A6560] text-sm mt-1">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#B8956A] text-[#0D0D0D] px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          ADD PRODUCT
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form method="get" className="flex items-center border border-[#2A2A2A] flex-1 max-w-xs">
          <Search className="w-4 h-4 text-[#6A6560] ml-3 flex-shrink-0" strokeWidth={1.5} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm text-[#E8E3DD] placeholder-[#4A4540] px-3 py-2 outline-none"
          />
          {status && <input type="hidden" name="status" value={status} />}
        </form>
        <div className="flex items-center gap-2">
          {["", "ACTIVE", "DRAFT", "ARCHIVED"].map((s) => (
            <a
              key={s || "all"}
              href={`/admin/products?${s ? `status=${s}` : ""}${q ? `&q=${q}` : ""}`}
              className={`text-[10px] tracking-[0.1em] px-3 py-1.5 border transition-colors ${
                (status ?? "") === s
                  ? "border-[#C9A96E] text-[#C9A96E]"
                  : "border-[#2A2A2A] text-[#6A6560] hover:border-[#4A4540]"
              }`}
            >
              {s || "ALL"}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#1E1E1E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E1E]">
                {["PRODUCT", "SKU", "CATEGORY", "PRICE", "INVENTORY", "STATUS", ""].map((h) => (
                  <th key={h} className="text-[9px] tracking-[0.15em] text-[#4A4540] font-medium text-left px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F0F0F]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-[#4A4540] py-12 text-sm">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-[#1A1A1A] border border-[#2A2A2A] flex-shrink-0 overflow-hidden">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={40}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#2A2A2A]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[#E8E3DD] text-xs font-medium">{product.name}</p>
                          {product.brand && (
                            <p className="text-[#6A6560] text-[10px]">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">{product.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">{product.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">{formatCurrency(parseFloat(String(product.price)))}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs ${
                          product.inventory <= 0
                            ? "text-[#E05252]"
                            : product.inventory <= 5
                            ? "text-[#C9A96E]"
                            : "text-[#52B788]"
                        }`}
                      >
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[9px] tracking-[0.1em] px-2 py-0.5 ${
                          product.status === "ACTIVE"
                            ? "text-[#52B788] bg-[#52B788]/10"
                            : product.status === "DRAFT"
                            ? "text-[#C9A96E] bg-[#C9A96E]/10"
                            : "text-[#6A6560] bg-[#1A1A1A]"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-[#6A6560] hover:text-[#C9A96E] transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-[#1E1E1E]">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/admin/products?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors ${
                  p === page
                    ? "border-[#C9A96E] text-[#C9A96E]"
                    : "border-[#2A2A2A] text-[#6A6560] hover:border-[#4A4540]"
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
