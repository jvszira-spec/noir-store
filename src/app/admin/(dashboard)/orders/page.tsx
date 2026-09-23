import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchParams {
  q?: string;
  status?: string;
  page?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "text-[#C9A96E] bg-[#C9A96E]/10",
  PROCESSING: "text-[#9A9590] bg-[#9A9590]/10",
  SHIPPED: "text-[#52B788] bg-[#52B788]/10",
  DELIVERED: "text-[#52B788] bg-[#52B788]/10",
  CANCELLED: "text-[#E05252] bg-[#E05252]/10",
  REFUNDED: "text-[#9A9590] bg-[#9A9590]/10",
  PAID: "text-[#52B788] bg-[#52B788]/10",
  FAILED: "text-[#E05252] bg-[#E05252]/10",
};

export default async function AdminOrdersPage({
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
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-light">Orders</h1>
          <p className="text-[#6A6560] text-sm mt-1">{total} orders total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form method="get" className="flex items-center border border-[#2A2A2A] flex-1 max-w-xs">
          <Search className="w-4 h-4 text-[#6A6560] ml-3" strokeWidth={1.5} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search orders..."
            className="flex-1 bg-transparent text-sm text-[#E8E3DD] placeholder-[#4A4540] px-3 py-2 outline-none"
          />
          {status && <input type="hidden" name="status" value={status} />}
        </form>
        <div className="flex flex-wrap gap-2">
          {["", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
            <a
              key={s || "all"}
              href={`/admin/orders?${s ? `status=${s}` : ""}${q ? `&q=${q}` : ""}`}
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
                {["ORDER", "DATE", "CUSTOMER", "ITEMS", "TOTAL", "PAYMENT", "STATUS"].map((h) => (
                  <th key={h} className="text-[9px] tracking-[0.15em] text-[#4A4540] font-medium text-left px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F0F0F]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-[#4A4540] py-12">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-[#C9A96E] hover:underline text-xs">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="text-[#E8E3DD]">{order.customerName}</div>
                      <div className="text-[#6A6560] text-[10px]">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-[#6A6560] text-xs">{order.items.length}</td>
                    <td className="px-4 py-3 text-xs">{formatCurrency(parseFloat(String(order.total)))}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-[0.1em] px-2 py-0.5 ${statusColors[order.paymentStatus] ?? "text-[#6A6560]"}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-[0.1em] px-2 py-0.5 ${statusColors[order.status] ?? "text-[#6A6560]"}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-[#1E1E1E]">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/admin/orders?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors ${
                  p === page ? "border-[#C9A96E] text-[#C9A96E]" : "border-[#2A2A2A] text-[#6A6560]"
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
