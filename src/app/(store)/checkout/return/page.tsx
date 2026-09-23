"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

function ReturnHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    const orderId = searchParams.get("order_id");

    if (!paymentIntentId || !orderId) {
      setStatus("error");
      setErrorMsg("Missing payment information.");
      return;
    }

    fetch("/api/stripe/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId, orderId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.orderId) {
          clearCart();
          router.replace(`/order-confirmation/${data.orderId}`);
        } else {
          setStatus("error");
          setErrorMsg(data.error ?? "Payment verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Something went wrong. Please contact support.");
      });
  }, [searchParams, router, clearCart]);

  if (status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#880A25]/30 border-t-[#880A25] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6A6560] text-sm">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-xl font-medium mb-2">Payment Issue</h1>
        <p className="text-[#6A6560] text-sm mb-6">{errorMsg}</p>
        <Link href="/checkout" className="text-[#880A25] hover:underline text-sm">
          Return to Checkout
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-[#880A25]/30 border-t-[#880A25] rounded-full animate-spin" />
        </div>
      }
    >
      <ReturnHandler />
    </Suspense>
  );
}
