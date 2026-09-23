"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-3xl font-light tracking-[0.3em] text-[#E8E3DD]">
            NOIR
          </span>
          <p className="text-[10px] tracking-[0.2em] text-[#6A6560] mt-2">ADMIN CONSOLE</p>
        </div>

        {/* Form */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-[#C9A96E]" strokeWidth={1.5} />
            <span className="text-[11px] tracking-[0.15em] text-[#9A9590]">SECURE LOGIN</span>
          </div>

          {error && (
            <div className="bg-[#E05252]/10 border border-[#E05252]/30 text-[#E05252] text-sm px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-3 text-sm outline-none transition-colors"
                placeholder="admin@noir-store.com"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] focus:border-[#C9A96E] text-[#E8E3DD] px-4 py-3 pr-10 text-sm outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6560] hover:text-[#9A9590] transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A96E] hover:bg-[#B8956A] disabled:opacity-60 text-[#0D0D0D] py-3.5 text-[11px] font-semibold tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#4A4540] mt-6">
          Admin access only. Not for customer use.
        </p>
      </div>
    </div>
  );
}
