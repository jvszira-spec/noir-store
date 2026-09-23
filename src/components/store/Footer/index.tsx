import Link from "next/link";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=cigarettes", label: "Cigarettes" },
  { href: "/shop?category=cartons", label: "Cigarette Cartons" },
  { href: "/shop?category=cigars", label: "Cigars" },
];

const infoLinks = [
  { href: "/about", label: "About NOIR" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping", label: "Shipping Info" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-[#F8F7F5] border-t border-[#ECEAE6]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-display text-3xl font-light tracking-[0.3em] text-[#1A1A1A]">NOIR</span>
            </Link>
            <p className="text-[13px] leading-relaxed text-[#9A9590] mb-6">
              Curated. Refined. Essential.
              <br />
              Premium tobacco products selected for discerning tastes.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="w-8 h-8 border border-[#DDD8D3] flex items-center justify-center text-[#9A9590] hover:text-[#880A25] hover:border-[#880A25] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth={0}/>
                </svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="w-8 h-8 border border-[#DDD8D3] flex items-center justify-center text-[#9A9590] hover:text-[#880A25] hover:border-[#880A25] transition-all duration-200">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] text-[#880A25] mb-5">SHOP</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[#9A9590] hover:text-[#1A1A1A] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] text-[#880A25] mb-5">INFORMATION</h4>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-[#9A9590] hover:text-[#1A1A1A] transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-medium tracking-[0.2em] text-[#880A25] mb-5">CONTACT</h4>
            <ul className="space-y-3 text-[13px] text-[#9A9590]">
              <li>support@noir-store.com</li>
              <li>Mon–Fri, 9am–6pm EST</li>
            </ul>
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.15em] text-[#9A9590] mb-3">LEGAL NOTICE</p>
              <p className="text-[11px] text-[#B5B0AB] leading-relaxed">
                This store sells tobacco products. You must be 19 years of age or older to purchase. Sales are subject to applicable provincial laws and shipping restrictions.
              </p>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-[#ECEAE6] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#B5B0AB]">© {new Date().getFullYear()} NOIR. All rights reserved.</p>
          <p className="text-[11px] text-[#B5B0AB]">For adults 19+ only · Not for sale to minors · Canada only</p>
        </div>
      </div>
    </footer>
  );
}
