"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface Props {
  user: { name?: string | null; email?: string | null };
}

export default function AdminHeader({ user }: Props) {
  return (
    <header className="bg-[#0D0D0D] border-b border-[#1E1E1E] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="lg:hidden">
        <span className="font-display text-lg font-light tracking-[0.2em]">NOIR</span>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 text-sm text-[#6A6560]">
          <User className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden sm:block text-[12px]">
            {user?.name ?? user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-[11px] text-[#6A6560] hover:text-[#E05252] transition-colors border border-[#2A2A2A] hover:border-[#E05252]/30 px-3 py-1.5"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  );
}
