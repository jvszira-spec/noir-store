"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  visible: boolean;
  sortOrder: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "", visible: true, sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        toast.success(editingId ? "Category updated" : "Category created");
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "", description: "", image: "", visible: true, sortOrder: 0 });
        fetchCategories();
      } else {
        const d = await res.json();
        toast.error(d.error ?? "Save failed");
      }
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    toast.success("Category deleted");
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description ?? "", image: cat.image ?? "", visible: cat.visible, sortOrder: cat.sortOrder });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-light">Categories</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: "", description: "", image: "", visible: true, sortOrder: 0 }); }}
          className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#B8956A] text-[#0D0D0D] px-4 py-2.5 text-[11px] font-semibold tracking-[0.15em] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> ADD CATEGORY
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#141414] border border-[#C9A96E]/30 p-6 mb-6">
          <h2 className="text-[11px] tracking-[0.15em] text-[#9A9590] mb-4">
            {editingId ? "EDIT CATEGORY" : "NEW CATEGORY"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">NAME *</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">IMAGE URL</label>
              <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.1em] text-[#9A9590] mb-1.5">DESCRIPTION</label>
              <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-2.5 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} className="accent-[#C9A96E]" />
                Visible in store
              </label>
              <div>
                <label className="text-[10px] text-[#9A9590] mr-2">SORT ORDER</label>
                <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-20 bg-[#0D0D0D] border border-[#2A2A2A] text-[#E8E3DD] px-2 py-1.5 text-sm outline-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#C9A96E] hover:bg-[#B8956A] text-[#0D0D0D] px-6 py-2 text-[11px] font-semibold tracking-[0.15em] transition-colors disabled:opacity-60">
              {saving ? "SAVING..." : (editingId ? "SAVE CHANGES" : "CREATE")}
            </button>
            <button onClick={() => setShowForm(false)} className="text-[11px] text-[#6A6560] hover:text-[#9A9590] transition-colors">
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-[#141414] border border-[#1E1E1E]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E1E1E]">
              {["CATEGORY", "SLUG", "PRODUCTS", "VISIBLE", "SORT", ""].map((h) => (
                <th key={h} className="text-[9px] tracking-[0.15em] text-[#4A4540] font-medium text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0F0F0F]">
            {loading ? (
              <tr><td colSpan={6} className="text-center text-[#4A4540] py-10">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-[#4A4540] py-10">No categories yet</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="px-4 py-3">
                  <p className="text-[#E8E3DD] text-xs font-medium">{cat.name}</p>
                  {cat.description && <p className="text-[#6A6560] text-[10px]">{cat.description}</p>}
                </td>
                <td className="px-4 py-3 text-[#6A6560] text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-xs">{cat._count.products}</td>
                <td className="px-4 py-3">
                  {cat.visible ? (
                    <Eye className="w-4 h-4 text-[#52B788]" strokeWidth={1.5} />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[#6A6560]" strokeWidth={1.5} />
                  )}
                </td>
                <td className="px-4 py-3 text-[#6A6560] text-xs">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => startEdit(cat)} className="text-[#6A6560] hover:text-[#C9A96E] transition-colors">
                      <Edit className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="text-[#6A6560] hover:text-[#E05252] transition-colors">
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
