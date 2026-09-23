import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { images: { where: { isPrimary: true }, take: 1 }, category: true },
    orderBy: { inventory: "asc" },
  });

  const outOfStock = products.filter((p) => p.inventory <= 0);
  const lowStock = products.filter((p) => p.inventory > 0 && p.inventory <= p.lowStockThreshold);
  const inStock = products.filter((p) => p.inventory > p.lowStockThreshold);

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-2">Inventory</h1>
      <p className="text-[#6A6560] text-sm mb-8">{products.length} active products</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#141414] border border-[#E05252]/20 p-4">
          <p className="text-[10px] tracking-[0.1em] text-[#E05252] mb-1">OUT OF STOCK</p>
          <p className="text-3xl font-light text-[#E05252]">{outOfStock.length}</p>
        </div>
        <div className="bg-[#141414] border border-[#C9A96E]/20 p-4">
          <p className="text-[10px] tracking-[0.1em] text-[#C9A96E] mb-1">LOW STOCK</p>
          <p className="text-3xl font-light text-[#C9A96E]">{lowStock.length}</p>
        </div>
        <div className="bg-[#141414] border border-[#52B788]/20 p-4">
          <p className="text-[10px] tracking-[0.1em] text-[#52B788] mb-1">IN STOCK</p>
          <p className="text-3xl font-light text-[#52B788]">{inStock.length}</p>
        </div>
      </div>

      {/* Critical alerts */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className="bg-[#141414] border border-[#C9A96E]/20 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#C9A96E]" strokeWidth={1.5} />
            <span className="text-[11px] tracking-[0.15em] text-[#C9A96E]">ATTENTION NEEDED</span>
          </div>
          <div className="space-y-1">
            {outOfStock.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-[#E8E3DD]">{p.name}</span>
                <span className="text-[#E05252] text-[11px] tracking-[0.1em]">OUT OF STOCK</span>
              </div>
            ))}
            {lowStock.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-[#E8E3DD]">{p.name}</span>
                <span className="text-[#C9A96E] text-[11px] tracking-[0.1em]">ONLY {p.inventory} LEFT</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      <div className="bg-[#141414] border border-[#1E1E1E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E1E]">
                {["PRODUCT", "SKU", "CATEGORY", "PRICE", "STOCK", "THRESHOLD", "STATUS"].map((h) => (
                  <th key={h} className="text-[9px] tracking-[0.15em] text-[#4A4540] font-medium text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F0F0F]">
              {products.map((p) => {
                const status =
                  p.inventory <= 0
                    ? { label: "OUT OF STOCK", color: "text-[#E05252] bg-[#E05252]/10" }
                    : p.inventory <= p.lowStockThreshold
                    ? { label: "LOW STOCK", color: "text-[#C9A96E] bg-[#C9A96E]/10" }
                    : { label: "IN STOCK", color: "text-[#52B788] bg-[#52B788]/10" };
                return (
                  <tr key={p.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs text-[#E8E3DD]">{p.name}</p>
                      {p.brand && <p className="text-[10px] text-[#6A6560]">{p.brand}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">{p.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">{p.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">{formatCurrency(parseFloat(String(p.price)))}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${p.inventory <= 0 ? "text-[#E05252]" : p.inventory <= p.lowStockThreshold ? "text-[#C9A96E]" : "text-[#52B788]"}`}>
                      {p.inventory}
                    </td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">{p.lowStockThreshold}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-[0.1em] px-2 py-0.5 ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
