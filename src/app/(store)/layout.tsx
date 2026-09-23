import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import AgeGate from "@/components/store/AgeGate";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgeGate />
      <Header />
      <CartDrawer />
      <main className="min-h-screen pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
