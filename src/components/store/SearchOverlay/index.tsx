"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  slug: string;
  image?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query)}`); onClose(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white border-b border-[#ECEAE6] shadow-md animate-slide-up">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <Search className="w-5 h-5 text-[#9A9590] flex-shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="flex-1 bg-transparent text-lg text-[#1A1A1A] placeholder-[#C0BBB6] outline-none"
            />
            <button type="button" onClick={onClose} className="text-[#9A9590] hover:text-[#1A1A1A] transition-colors" aria-label="Close search">
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </form>

          {query.trim() && (
            <div className="mt-4 pb-2">
              {loading ? (
                <div className="space-y-3 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 bg-[#F0EFED] rounded" />
                      <div className="flex-1">
                        <div className="h-3 bg-[#F0EFED] rounded w-1/2 mb-2" />
                        <div className="h-3 bg-[#F0EFED] rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1 pt-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-2 hover:bg-[#F8F7F5] transition-colors group"
                    >
                      <div className="w-12 h-12 bg-[#F8F7F5] border border-[#ECEAE6] flex-shrink-0 overflow-hidden">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#F0EFED]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {product.brand && <p className="text-[10px] tracking-[0.1em] text-[#9A9590] mb-0.5">{product.brand}</p>}
                        <p className="text-sm text-[#1A1A1A] truncate">{product.name}</p>
                      </div>
                      <span className="text-[#880A25] text-sm font-medium flex-shrink-0">{formatCurrency(product.price)}</span>
                    </Link>
                  ))}
                  <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onClose} className="flex items-center gap-2 p-2 text-[11px] tracking-[0.1em] text-[#880A25] hover:text-[#1A1A1A] transition-colors mt-2">
                    <span>VIEW ALL RESULTS FOR "{query.toUpperCase()}"</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <p className="text-[#9A9590] text-sm pt-4 pb-2">No products found for "{query}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
