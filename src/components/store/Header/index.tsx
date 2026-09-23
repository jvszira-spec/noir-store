"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, User, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const shopLinks = [
  { href: "/shop?category=cigarettes", label: "Cigarettes" },
  { href: "/shop?category=cartons", label: "Cigarette Cartons" },
  { href: "/shop?category=cigars", label: "Cigars" },
  { href: "/shop", label: "All Products" },
];

const brandLinks = [
  "Canadian Classic", "Belmont", "Next", "John Player",
  "Player's", "Du Maurier", "LD", "Yellowstone",
  "BC Kings", "Select", "Eclipse", "Playfare",
];

const mobileLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=cigarettes", label: "Cigarettes" },
  { href: "/shop?category=cartons", label: "Cigarette Cartons" },
  { href: "/shop?category=cigars", label: "Cigars" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [query, setQuery] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const shopRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { openCart, totalItems, totalPrice } = useCart();
  const itemCount = mounted ? totalItems() : 0;
  const cartTotal = mounted ? totalPrice() : 0;

  useEffect(() => { setMounted(true); }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
      if (brandsRef.current && !brandsRef.current.contains(e.target as Node)) setBrandsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setShopOpen(false);
    setBrandsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-[#EADCDF] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center gap-3 h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-2">
            <span className="font-display text-2xl font-semibold tracking-[0.2em] text-[#880A25]">
              NOIR
            </span>
          </Link>

          {/* Search bar — hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="flex-1 h-10 border border-[#EADCDF] border-r-0 rounded-l-full pl-4 pr-2 text-sm text-[#2F1820] placeholder-[#BFB8B8] outline-none focus:border-[#880A25] bg-white transition-colors"
            />
            <button
              type="submit"
              className="h-10 px-5 bg-[#880A25] hover:bg-[#6D0820] text-white text-sm font-semibold rounded-r-full transition-colors duration-200 flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">

            {/* Shop dropdown */}
            <div ref={shopRef} className="relative">
              <button
                onClick={() => { setShopOpen(v => !v); setBrandsOpen(false); }}
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-[#2F1820] hover:text-[#880A25] transition-colors rounded-lg hover:bg-[#FFF0F2]"
              >
                Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`} strokeWidth={2} />
              </button>
              {shopOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-[#EADCDF] rounded-xl shadow-lg py-1.5 z-50">
                  {shopLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-[13px] text-[#2F1820] hover:bg-[#FFF0F2] hover:text-[#880A25] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Brands dropdown */}
            <div ref={brandsRef} className="relative">
              <button
                onClick={() => { setBrandsOpen(v => !v); setShopOpen(false); }}
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-[#2F1820] hover:text-[#880A25] transition-colors rounded-lg hover:bg-[#FFF0F2]"
              >
                Brands <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${brandsOpen ? "rotate-180" : ""}`} strokeWidth={2} />
              </button>
              {brandsOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-[#EADCDF] rounded-xl shadow-lg py-1.5 z-50 max-h-72 overflow-y-auto">
                  {brandLinks.map((brand) => (
                    <Link
                      key={brand}
                      href={`/search?q=${encodeURIComponent(brand)}`}
                      className="block px-4 py-2.5 text-[13px] text-[#2F1820] hover:bg-[#FFF0F2] hover:text-[#880A25] transition-colors"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="px-3 py-2 text-[13px] font-medium text-[#2F1820] hover:text-[#880A25] transition-colors rounded-lg hover:bg-[#FFF0F2]">
              About
            </Link>

            <Link href="/contact" className="px-3 py-2 text-[13px] font-medium text-[#2F1820] hover:text-[#880A25] transition-colors rounded-lg hover:bg-[#FFF0F2]">
              Contact
            </Link>

          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Account */}
            <Link
              href="/admin/login"
              aria-label="Account"
              className="p-2 text-[#2F1820] hover:text-[#880A25] hover:bg-[#FFF0F2] rounded-full transition-colors"
            >
              <User className="w-5 h-5" strokeWidth={1.8} />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full border border-[#EADCDF] hover:border-[#880A25] transition-colors duration-200 relative"
            >
              <ShoppingCart className="w-5 h-5 text-[#880A25]" strokeWidth={1.8} />
              {cartTotal > 0 && (
                <span className="text-[13px] font-semibold text-[#2F1820]">
                  ${cartTotal.toFixed(2)}
                </span>
              )}
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#880A25] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-[#2F1820] hover:text-[#880A25] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.8} />
            </button>

          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="flex-1 h-9 border border-[#EADCDF] border-r-0 rounded-l-full pl-4 text-sm text-[#2F1820] placeholder-[#BFB8B8] outline-none bg-white"
            />
            <button
              type="submit"
              className="h-9 px-4 bg-[#880A25] text-white text-sm font-semibold rounded-r-full"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between p-5 border-b border-[#EADCDF]">
            <span className="font-display text-xl font-semibold tracking-[0.2em] text-[#880A25]">NOIR</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close" className="text-[#9A9590] hover:text-[#2F1820] transition-colors">
              <X className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>
          <nav className="flex flex-col p-5 gap-0.5 overflow-y-auto flex-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 px-3 text-[13px] font-medium border-b border-[#F5F0F0] rounded-lg transition-colors ${pathname === link.href ? "text-[#880A25] bg-[#FFF0F2]" : "text-[#2F1820] hover:text-[#880A25] hover:bg-[#FFF0F2]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
