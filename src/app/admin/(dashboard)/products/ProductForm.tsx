"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, X, Upload, Star } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface Props {
  categories: Category[];
  productId?: string;
  defaultValues?: Record<string, unknown>;
  defaultImages?: ProductImage[];
}

export default function ProductForm({ categories, productId, defaultValues, defaultImages = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(defaultImages);
  const [uploadingImage, setUploadingImage] = useState(false);

  const isEdit = !!productId;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      name: formData.get("name"),
      description: formData.get("description"),
      shortDescription: formData.get("shortDescription"),
      brand: formData.get("brand"),
      sku: formData.get("sku"),
      price: formData.get("price"),
      compareAtPrice: formData.get("compareAtPrice") || null,
      inventory: formData.get("inventory"),
      lowStockThreshold: formData.get("lowStockThreshold"),
      categoryId: formData.get("categoryId") || null,
      featured: formData.get("featured") === "on",
      status: formData.get("status"),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success(isEdit ? "Product updated" : "Product created");
      if (!isEdit) router.push(`/admin/products/${result.product.id}/edit`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productId) {
      toast.error("Save the product first before uploading images");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("isPrimary", images.length === 0 ? "true" : "false");
    try {
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: fd,
      });
      const { image } = await res.json();
      setImages((prev) => [...prev, image]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = async (imageId: string) => {
    if (!productId) return;
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    setImages((prev) => prev.filter((i) => i.id !== imageId));
  };

  const setPrimary = async (imageId: string) => {
    if (!productId) return;
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: null, setPrimary: imageId }),
    });
    setImages((prev) => prev.map((i) => ({ ...i, isPrimary: i.id === imageId })));
  };

  const Field = ({
    label,
    name,
    type = "text",
    defaultValue,
    required,
    half,
    placeholder,
  }: {
    label: string;
    name: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    half?: boolean;
    placeholder?: string;
  }) => (
    <div className={half ? "" : "col-span-2"}>
      <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
        {label}
        {required && <span className="text-[#C9A96E]"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none transition-colors"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic info */}
      <div className="bg-[#141414] border border-[#1E1E1E] p-6">
        <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
          BASIC INFORMATION
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="PRODUCT NAME" name="name" required defaultValue={defaultValues?.name as string} />
          <Field label="BRAND" name="brand" defaultValue={defaultValues?.brand as string} half placeholder="e.g. Marlboro" />
          <Field label="SKU" name="sku" defaultValue={defaultValues?.sku as string} half placeholder="e.g. MAR-RED-20" />
          <div className="col-span-2">
            <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
              SHORT DESCRIPTION
            </label>
            <input
              name="shortDescription"
              defaultValue={defaultValues?.shortDescription as string}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none transition-colors"
              placeholder="Brief one-line description"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
              FULL DESCRIPTION
            </label>
            <textarea
              name="description"
              defaultValue={defaultValues?.description as string}
              rows={5}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none transition-colors resize-none"
              placeholder="Detailed product description..."
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-[#141414] border border-[#1E1E1E] p-6">
        <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
          PRICING & INVENTORY
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="PRICE *" name="price" type="number" required defaultValue={String(defaultValues?.price ?? "")} half placeholder="0.00" />
          <Field label="COMPARE AT PRICE" name="compareAtPrice" type="number" defaultValue={String(defaultValues?.compareAtPrice ?? "")} half placeholder="0.00" />
          <Field label="INVENTORY" name="inventory" type="number" required defaultValue={String(defaultValues?.inventory ?? "0")} half />
          <Field label="LOW STOCK THRESHOLD" name="lowStockThreshold" type="number" defaultValue={String(defaultValues?.lowStockThreshold ?? "5")} half />
        </div>
      </div>

      {/* Organisation */}
      <div className="bg-[#141414] border border-[#1E1E1E] p-6">
        <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
          ORGANISATION
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">CATEGORY</label>
            <select
              name="categoryId"
              defaultValue={(defaultValues?.categoryId as string) ?? ""}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">STATUS</label>
            <select
              name="status"
              defaultValue={(defaultValues?.status as string) ?? "ACTIVE"}
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              defaultChecked={defaultValues?.featured as boolean}
              className="accent-[#C9A96E]"
            />
            <label htmlFor="featured" className="text-sm text-[#9A9590] cursor-pointer">
              Featured product
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      {isEdit && (
        <div className="bg-[#141414] border border-[#1E1E1E] p-6">
          <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-5 pb-3 border-b border-[#1E1E1E]">
            PRODUCT IMAGES
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square bg-[#1A1A1A] border border-[#2A2A2A] group overflow-hidden">
                <Image src={img.url} alt="" fill className="object-cover" />
                {img.isPrimary && (
                  <div className="absolute top-1 left-1 bg-[#C9A96E] text-[#0D0D0D] text-[8px] px-1.5 py-0.5 font-bold">
                    MAIN
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(img.id)}
                      className="w-6 h-6 bg-[#C9A96E] text-[#0D0D0D] flex items-center justify-center"
                      title="Set as primary"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="w-6 h-6 bg-[#E05252] text-white flex items-center justify-center"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            <label className="aspect-square bg-[#0D0D0D] border border-dashed border-[#2A2A2A] hover:border-[#C9A96E] flex flex-col items-center justify-center cursor-pointer transition-colors gap-1">
              {uploadingImage ? (
                <div className="w-5 h-5 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-[#4A4540]" strokeWidth={1.5} />
                  <span className="text-[9px] text-[#4A4540]">ADD IMAGE</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
            </label>
          </div>
          <p className="text-[11px] text-[#4A4540]">
            Supported: JPG, PNG, WebP. Click ★ to set main image.
          </p>
        </div>
      )}

      {!isEdit && (
        <p className="text-[12px] text-[#6A6560] bg-[#141414] border border-[#1E1E1E] p-4">
          💡 Save the product first, then you can upload images on the edit page.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C9A96E] hover:bg-[#B8956A] disabled:opacity-60 text-[#0D0D0D] px-8 py-3 text-[11px] font-semibold tracking-[0.15em] transition-colors flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />}
          {isEdit ? "SAVE CHANGES" : "CREATE PRODUCT"}
        </button>
        <a
          href="/admin/products"
          className="text-[11px] tracking-[0.1em] text-[#6A6560] hover:text-[#9A9590] transition-colors"
        >
          CANCEL
        </a>
      </div>
    </form>
  );
}
