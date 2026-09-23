"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import type { ProductImageType } from "@/types";

interface Props {
  images: ProductImageType[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!images.length) {
    return (
      <div className="aspect-square bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
        <span className="text-[#4A4540] text-sm">No image</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative aspect-square lg:aspect-[4/5] bg-[#1A1A1A] overflow-hidden group">
          <Image
            src={activeImage.url}
            alt={activeImage.alt ?? productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0D0D0D]/70 hover:bg-[#0D0D0D] text-[#E8E3DD] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0D0D0D]/70 hover:bg-[#0D0D0D] text-[#E8E3DD] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Zoom button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 w-9 h-9 bg-[#0D0D0D]/70 hover:bg-[#0D0D0D] text-[#E8E3DD] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            aria-label="View full image"
          >
            <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-[#0D0D0D]/70 backdrop-blur-sm text-[10px] tracking-[0.1em] text-[#9A9590] px-2 py-1">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-square overflow-hidden border transition-all duration-200 ${
                  idx === activeIndex
                    ? "border-[#880A25]"
                    : "border-[#2A2A2A] hover:border-[#4A4540]"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `${productName} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="10vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 border border-[#2A2A2A] text-[#9A9590] hover:text-[#E8E3DD] flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <div className="relative w-[90vw] h-[90vh] max-w-[900px]">
            <Image
              src={activeImage.url}
              alt={activeImage.alt ?? productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-[#2A2A2A] text-[#9A9590] hover:text-[#E8E3DD] flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-[#2A2A2A] text-[#9A9590] hover:text-[#E8E3DD] flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
