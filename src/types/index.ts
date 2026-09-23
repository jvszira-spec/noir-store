import { Prisma } from "@prisma/client";

export interface CartItem {
  id: string;
  name: string;
  brand?: string;
  price: number;
  image?: string;
  quantity: number;
  inventory: number;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

export type ProductImageType = Prisma.ProductImageGetPayload<Record<never, never>>;

export type CategoryType = Prisma.CategoryGetPayload<Record<never, never>>;

// Plain-object version safe to pass from Server → Client components
export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  inventory: number;
  lowStockThreshold: number | null;
  featured: boolean;
  status: string;
  avgRating: number | null;
  reviewCount: number;
  images: { id: string; url: string; alt: string | null; isPrimary: boolean; sortOrder: number }[];
  category: { id: string; name: string; slug: string } | null;
}

export function serializeProduct(p: ProductWithRelations): SerializedProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    shortDescription: p.shortDescription,
    price: parseFloat(String(p.price)),
    compareAtPrice: p.compareAtPrice ? parseFloat(String(p.compareAtPrice)) : null,
    inventory: p.inventory,
    lowStockThreshold: p.lowStockThreshold,
    featured: p.featured,
    status: p.status,
    avgRating: (p as unknown as { avgRating: number | null }).avgRating ?? null,
    reviewCount: (p as unknown as { reviewCount: number }).reviewCount ?? 0,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
      : null,
  };
}

export interface OrderItemType {
  id: string;
  name: string;
  brand: string | null;
  sku: string | null;
  price: string | number;
  quantity: number;
  imageUrl: string | null;
}

export interface AddressType {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
  agreeToTerms: true;
  ageConfirmation: true;
}
