import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalOrders,
    totalRevenue,
    totalProducts,
    lowStockCount,
    recentOrders,
    ordersThisMonth,
    revenueThisMonth,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({
      where: { inventory: { gt: 0, lte: 5 }, status: "ACTIVE" },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
    }),
  ]);

  return Response.json({
    stats: {
      totalOrders,
      totalRevenue: parseFloat(String(totalRevenue._sum.total ?? 0)),
      totalProducts,
      lowStockCount,
      ordersThisMonth,
      revenueThisMonth: parseFloat(String(revenueThisMonth._sum.total ?? 0)),
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customerName,
      email: o.customerEmail,
      total: parseFloat(String(o.total)),
      status: o.status,
      paymentStatus: o.paymentStatus,
      itemCount: o.items.length,
      createdAt: o.createdAt,
    })),
  });
}
