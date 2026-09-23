"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ current }: { current?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        value={current ?? ""}
        onChange={handleChange}
        className="appearance-none bg-white border border-[#DDD8D3] text-[#5A5550] text-[11px] tracking-[0.1em] px-4 py-2 pr-8 outline-none cursor-pointer hover:border-[#880A25] transition-colors"
      >
        <option value="">Sort by: Featured</option>
        <option value="newest">Sort by: Newest</option>
        <option value="price_asc">Sort by: Price Low to High</option>
        <option value="price_desc">Sort by: Price High to Low</option>
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6A6560] text-xs">▾</span>
    </div>
  );
}
