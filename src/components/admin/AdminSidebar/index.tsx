"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Warehouse,
  Users,
  Truck,
  Settings,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/shipping-rules", label: "Shipping", icon: Truck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#0D0D0D] border-r border-[#1E1E1E] flex flex-col z-40 hidden lg:flex">
      {/* Logo */}
      <div className="p-6 border-b border-[#1E1E1E]">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="font-display text-xl font-light tracking-[0.25em]">NOIR</span>
          <span className="text-[9px] tracking-[0.15em] text-[#6A6560] bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-0.5">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-all duration-150 ${
                active
                  ? "text-[#C9A96E] bg-[#C9A96E]/5 border-r-2 border-[#C9A96E]"
                  : "text-[#6A6560] hover:text-[#9A9590] hover:bg-[#1A1A1A]"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
              <span className="text-[12px] tracking-[0.05em]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1E1E1E]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-[11px] text-[#4A4540] hover:text-[#6A6560] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
          View Store
        </Link>
      </div>
    </aside>
  );
}
