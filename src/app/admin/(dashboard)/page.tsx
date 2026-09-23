import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboard() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalOrders,
    paidRevenue,
    totalProducts,
    lowStockCount,
    recentOrders,
    ordersThisMonth,
    revenueThisMonth,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { inventory: { gt: 0, lte: 5 }, status: "ACTIVE" } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
    }),
  ]);

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(parseFloat(String(paidRevenue._sum.total ?? 0))),
      sub: `${formatCurrency(parseFloat(String(revenueThisMonth._sum.total ?? 0)))} this month`,
      icon: DollarSign,
      color: "text-[#52B788]",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      sub: `${ordersThisMonth} this month`,
      icon: ShoppingCart,
      color: "text-[#C9A96E]",
    },
    {
      title: "Active Products",
      value: totalProducts.toString(),
      sub: "In your catalogue",
      icon: Package,
      color: "text-[#9A9590]",
    },
    {
      title: "Low Stock",
      value: lowStockCount.toString(),
      sub: lowStockCount > 0 ? "Needs attention" : "All good",
      icon: AlertTriangle,
      color: lowStockCount > 0 ? "text-[#E05252]" : "text-[#52B788]",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">Dashboard</h1>
        <p className="text-[#6A6560] text-sm mt-1">Welcome back. Here's your store at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-[#141414] border border-[#1E1E1E] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] tracking-[0.15em] text-[#6A6560] mb-1">{stat.title}</p>
                <p className="text-2xl font-light">{stat.value}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
            </div>
            <p className="text-[12px] text-[#4A4540]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-[#141414] border border-[#1E1E1E]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C9A96E]" strokeWidth={1.5} />
            <span className="text-[11px] tracking-[0.15em] text-[#9A9590]">RECENT ORDERS</span>
          </div>
          <Link
            href="/admin/orders"
            className="text-[10px] tracking-[0.1em] text-[#6A6560] hover:text-[#C9A96E] flex items-center gap-1 transition-colors"
          >
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E1E]">
                {["ORDER", "CUSTOMER", "ITEMS", "TOTAL", "PAYMENT", "STATUS", "DATE"].map((h) => (
                  <th key={h} className="text-[9px] tracking-[0.15em] text-[#4A4540] font-medium text-left px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F0F0F]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-[#4A4540] py-10 text-sm">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#C9A96E] hover:underline text-xs"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-[#9A9590] text-xs">
                      <div>{order.customerName}</div>
                      <div className="text-[#6A6560]">{order.customerEmail}</div>
                    </td>
                    <td className="px-5 py-3 text-[#6A6560] text-xs">{order.items.length}</td>
                    <td className="px-5 py-3 text-xs">{formatCurrency(parseFloat(String(order.total)))}</td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        value={order.paymentStatus}
                        type="payment"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge value={order.status} type="order" />
                    </td>
                    <td className="px-5 py-3 text-[#6A6560] text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link
          href="/admin/products/new"
          className="bg-[#141414] border border-[#1E1E1E] hover:border-[#C9A96E]/30 p-5 flex items-center gap-3 transition-all group"
        >
          <Package className="w-5 h-5 text-[#C9A96E]" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-[#E8E3DD] group-hover:text-[#C9A96E] transition-colors">Add New Product</p>
            <p className="text-[11px] text-[#6A6560]">Add to your catalogue</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-[#141414] border border-[#1E1E1E] hover:border-[#C9A96E]/30 p-5 flex items-center gap-3 transition-all group"
        >
          <ShoppingCart className="w-5 h-5 text-[#C9A96E]" strokeWidth={1.5} />
          <div>
            <p className="text-sm text-[#E8E3DD] group-hover:text-[#C9A96E] transition-colors">Manage Orders</p>
            <p className="text-[11px] text-[#6A6560]">View and process orders</p>
          </div>
        </Link>
        <Link
          href="/admin/inventory"
          className="bg-[#141414] border border-[#1E1E1E] hover:border-[#C9A96E]/30 p-5 flex items-center gap-3 transition-all group"
        >
          <AlertTriangle className={`w-5 h-5 ${lowStockCount > 0 ? "text-[#E05252]" : "text-[#C9A96E]"}`} strokeWidth={1.5} />
          <div>
            <p className="text-sm text-[#E8E3DD] group-hover:text-[#C9A96E] transition-colors">
              Inventory {lowStockCount > 0 && `(${lowStockCount} low)`}
            </p>
            <p className="text-[11px] text-[#6A6560]">Monitor stock levels</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ value, type }: { value: string; type: "order" | "payment" }) {
  const colors: Record<string, string> = {
    PENDING: "text-[#C9A96E] bg-[#C9A96E]/10",
    PROCESSING: "text-[#9A9590] bg-[#9A9590]/10",
    SHIPPED: "text-[#52B788] bg-[#52B788]/10",
    DELIVERED: "text-[#52B788] bg-[#52B788]/10",
    CANCELLED: "text-[#E05252] bg-[#E05252]/10",
    REFUNDED: "text-[#9A9590] bg-[#9A9590]/10",
    PAID: "text-[#52B788] bg-[#52B788]/10",
    FAILED: "text-[#E05252] bg-[#E05252]/10",
    AUTHORIZED: "text-[#C9A96E] bg-[#C9A96E]/10",
  };
  return (
    <span className={`text-[9px] tracking-[0.1em] font-medium px-2 py-0.5 ${colors[value] ?? "text-[#6A6560] bg-[#1A1A1A]"}`}>
      {value}
    </span>
  );
}
