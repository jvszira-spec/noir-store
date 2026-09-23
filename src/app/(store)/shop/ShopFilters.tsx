"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  brands: string[];
  currentParams: Record<string, string | undefined>;
}

export default function ShopFilters({ categories, brands, currentParams }: Props) {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>("category");

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key && k !== "page") params.set(k, v);
    });
    if (value) params.set(key, value);
    router.push(`/shop?${params.toString()}`);
  };

  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ];

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-[#1E1E1E] py-4">
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="flex items-center justify-between w-full text-[11px] tracking-[0.15em] text-[#9A9590] hover:text-[#E8E3DD] transition-colors"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            openSection === id ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>
      {openSection === id && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  const FilterItem = ({
    active,
    onClick,
    label,
  }: {
    active: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm w-full text-left transition-colors duration-200 ${
        active ? "text-[#880A25]" : "text-[#6A6560] hover:text-[#9A9590]"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
          active ? "border-[#880A25] bg-[#880A25]" : "border-[#2A2A2A]"
        }`}
      >
        {active && <span className="w-1.5 h-1.5 bg-[#0D0D0D]" />}
      </span>
      {label}
    </button>
  );

  return (
    <aside className="lg:w-56 flex-shrink-0">
      {/* Sort (mobile-first on top) */}
      <div className="lg:hidden mb-6">
        <select
          value={currentParams.sort ?? ""}
          onChange={(e) => updateParam("sort", e.target.value || null)}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#E8E3DD] text-sm px-3 py-2.5 outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#2A2A2A]">
        <span className="text-[11px] tracking-[0.2em] text-[#9A9590]">FILTER</span>
        {(currentParams.category || currentParams.brand || currentParams.sort) && (
          <a
            href="/shop"
            className="text-[10px] text-[#6A6560] hover:text-[#880A25] transition-colors tracking-[0.1em]"
          >
            CLEAR ALL
          </a>
        )}
      </div>

      {/* Sort - desktop */}
      <div className="hidden lg:block">
        <Section id="sort" title="SORT BY">
          {sortOptions.map((opt) => (
            <FilterItem
              key={opt.value}
              active={(currentParams.sort ?? "") === opt.value}
              onClick={() => updateParam("sort", opt.value || null)}
              label={opt.label}
            />
          ))}
        </Section>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <Section id="category" title="CATEGORY">
          <FilterItem
            active={!currentParams.category}
            onClick={() => updateParam("category", null)}
            label="All Products"
          />
          {categories.map((cat) => (
            <FilterItem
              key={cat.id}
              active={currentParams.category === cat.slug}
              onClick={() => updateParam("category", cat.slug)}
              label={cat.name}
            />
          ))}
        </Section>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <Section id="brand" title="BRAND">
          {brands.map((brand) => (
            <FilterItem
              key={brand}
              active={currentParams.brand === brand}
              onClick={() =>
                updateParam("brand", currentParams.brand === brand ? null : brand)
              }
              label={brand}
            />
          ))}
        </Section>
      )}

      {/* Price */}
      <Section id="price" title="PRICE">
        {[
          { label: "Under $25", min: "", max: "25" },
          { label: "$25 – $50", min: "25", max: "50" },
          { label: "$50 – $100", min: "50", max: "100" },
          { label: "Over $100", min: "100", max: "" },
        ].map((range) => (
          <FilterItem
            key={range.label}
            active={
              currentParams.minPrice === range.min &&
              currentParams.maxPrice === range.max
            }
            onClick={() => {
              if (
                currentParams.minPrice === range.min &&
                currentParams.maxPrice === range.max
              ) {
                updateParam("minPrice", null);
                updateParam("maxPrice", null);
              } else {
                const params = new URLSearchParams();
                Object.entries(currentParams).forEach(([k, v]) => {
                  if (v && k !== "minPrice" && k !== "maxPrice" && k !== "page")
                    params.set(k, v);
                });
                if (range.min) params.set("minPrice", range.min);
                if (range.max) params.set("maxPrice", range.max);
                router.push(`/shop?${params.toString()}`);
              }
            }}
            label={range.label}
          />
        ))}
      </Section>

      {/* Availability */}
      <Section id="availability" title="AVAILABILITY">
        <FilterItem
          active={currentParams.availability === "in_stock"}
          onClick={() =>
            updateParam(
              "availability",
              currentParams.availability === "in_stock" ? null : "in_stock"
            )
          }
          label="In Stock"
        />
      </Section>
    </aside>
  );
}
