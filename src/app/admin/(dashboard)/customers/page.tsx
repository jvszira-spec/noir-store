import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function CustomersPage() {
  const customers = await prisma.order.groupBy({
    by: ["customerEmail", "customerName"],
    _count: { id: true },
    _sum: { total: true },
    orderBy: { _count: { id: "desc" } },
    take: 50,
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-2">Customers</h1>
      <p className="text-[#6A6560] text-sm mb-8">
        Order contacts — {customers.length} unique customers
      </p>

      <div className="bg-[#141414] border border-[#1E1E1E] text-[11px] text-[#6A6560] p-4 mb-5">
        Customer information is collected per-order. No customer accounts exist.
        This list shows all email addresses that have placed orders.
      </div>

      <div className="bg-[#141414] border border-[#1E1E1E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E1E]">
                {["NAME", "EMAIL", "ORDERS", "TOTAL SPENT"].map((h) => (
                  <th key={h} className="text-[9px] tracking-[0.15em] text-[#4A4540] font-medium text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F0F0F]">
              {customers.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-[#4A4540] py-10">No orders yet</td></tr>
              ) : customers.map((c) => (
                <tr key={c.customerEmail} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-4 py-3 text-xs text-[#E8E3DD]">{c.customerName}</td>
                  <td className="px-4 py-3 text-xs text-[#9A9590]">{c.customerEmail}</td>
                  <td className="px-4 py-3 text-xs">{c._count.id}</td>
                  <td className="px-4 py-3 text-xs text-[#C9A96E]">
                    {formatCurrency(parseFloat(String(c._sum.total ?? 0)))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
