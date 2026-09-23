"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Lock, ChevronDown, ChevronUp, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CheckoutFormData } from "@/types";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// PayPal
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function InputField({
  label, name, type = "text", placeholder, required, half, register, errors,
}: {
  label: string; name: keyof CheckoutFormData; type?: string;
  placeholder?: string; required?: boolean; half?: boolean;
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
        {label}{required && <span className="text-[#880A25]"> *</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-[#F8F7F5] border text-[#2F1820] px-4 py-3 text-sm outline-none transition-colors ${
          errors[name] ? "border-red-400 focus:border-red-500" : "border-[#EADCDF] focus:border-[#880A25]"
        }`}
      />
      {errors[name] && <p className="text-red-500 text-[11px] mt-1">{errors[name]?.message as string}</p>}
    </div>
  );
}

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone required"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  shippingMethod: z.string().min(1, "Select a shipping method"),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
  ageConfirmation: z.literal(true, { errorMap: () => ({ message: "You must confirm you are 19 or older" }) }),
});

const shippingOptions = [
  { id: "standard", label: "Standard Shipping", price: 8.99, estimate: "5–7 business days" },
  { id: "express", label: "Express Shipping", price: 18.99, estimate: "2–3 business days" },
  { id: "overnight", label: "Overnight", price: 34.99, estimate: "Next business day" },
];

const FREE_SHIPPING_THRESHOLD = 75;

// ─── Stripe payment form ───
function StripePayForm({
  orderId,
  total,
  onBack,
}: {
  orderId: string;
  total: number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const router = useRouter();
  const { clearCart } = useCart();

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);

    const returnUrl = `${window.location.origin}/checkout/return?order_id=${orderId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message ?? "Payment failed. Please try again.");
      setPaying(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const res = await fetch("/api/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id, orderId }),
      });
      const data = await res.json();
      if (data.orderId) {
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        toast.error(data.error ?? "Order confirmation failed.");
        setPaying(false);
      }
    } else {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card", "apple_pay", "google_pay"],
        }}
      />
      <button
        type="submit"
        disabled={!stripe || !elements || paying}
        className="w-full flex items-center justify-center gap-3 bg-[#880A25] hover:bg-[#6D0820] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors rounded-sm"
      >
        {paying ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Lock className="w-3.5 h-3.5" strokeWidth={2} />
            PAY {formatCurrency(total)}
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onBack}
        disabled={paying}
        className="w-full text-center text-[11px] text-[#6A6560] hover:text-[#9A9590] transition-colors flex items-center justify-center gap-1"
      >
        <ArrowLeft className="w-3 h-3" /> Change payment method
      </button>
    </form>
  );
}

// ─── Main checkout page ───
export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  // step: "form" | "payment"
  const [step, setStep] = useState<"form" | "payment">("form");
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const {
    register, handleSubmit, watch, trigger, getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "CA", shippingMethod: "standard" },
  });

  const selectedShipping = watch("shippingMethod");
  const subtotal = totalPrice();
  const shippingOption = shippingOptions.find((s) => s.id === selectedShipping);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (shippingOption?.price ?? 8.99);
  const discountAmount = promoApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = subtotal - discountAmount + shippingCost;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "WELCOMENOIR") {
      setPromoApplied(true);
      setPromoError("");
      toast.success("10% discount applied!");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code.");
    }
  };

  const buildPayload = useCallback(() => {
    const data = getValues();
    return {
      ...data,
      items: items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        name: i.name,
        brand: i.brand,
        image: i.image,
      })),
      subtotal,
      shippingCost,
      total,
    };
  }, [getValues, items, subtotal, shippingCost, total]);

  // "Continue to Payment" — creates Stripe PI + pending order
  const onFormSubmit = async () => {
    setLoadingPayment(true);
    try {
      const payload = buildPayload();
      const res = await fetch("/api/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not initialise payment.");
        return;
      }
      setClientSecret(data.clientSecret);
      setPendingOrderId(data.orderId);
      setStep("payment");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleBack = () => {
    setStep("form");
    setClientSecret(null);
    setPendingOrderId(null);
  };

  // PayPal handlers
  const createPayPalOrder = async (): Promise<string> => {
    const valid = await trigger();
    if (!valid) {
      toast.error("Please fill in all required fields before paying with PayPal.");
      throw new Error("Form validation failed");
    }
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const data = await res.json();
    return data.id as string;
  };

  const onPayPalApprove = async (data: { orderID: string }) => {
    const payload = buildPayload();
    const res = await fetch("/api/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalOrderId: data.orderID, ...payload }),
    });
    const result = await res.json();
    if (result.orderId) {
      clearCart();
      router.push(`/order-confirmation/${result.orderId}`);
    } else {
      toast.error(result.error ?? "PayPal payment failed.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-3xl font-light mb-4">Your cart is empty</h1>
        <Link href="/shop" className="text-[#880A25] hover:underline text-sm">Continue Shopping</Link>
      </div>
    );
  }

  const OrderSummary = () => (
    <div className="bg-[#F8F7F5] border border-[#EADCDF] p-6 sticky top-24">
      <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-5">ORDER SUMMARY</h2>
      <div className="space-y-4 mb-5 divide-y divide-[#EADCDF]">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 pt-4 first:pt-0">
            <div className="relative w-14 h-16 bg-white border border-[#EADCDF] flex-shrink-0 overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-[#EADCDF]" />
              )}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#880A25] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#2F1820] line-clamp-2 leading-snug">{item.name}</p>
              <p className="text-[#880A25] text-sm mt-1">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Promo code */}
      <div className="border-t border-[#EADCDF] pt-4">
        <div className="flex gap-2">
          <input
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
            placeholder="Promo code"
            className="flex-1 bg-[#F8F7F5] border border-[#EADCDF] focus:border-[#880A25] text-[#2F1820] px-3 py-2 text-xs outline-none transition-colors"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="px-4 py-2 bg-[#2F1820] hover:bg-[#880A25] text-white text-[10px] font-semibold tracking-[0.1em] transition-colors"
          >
            APPLY
          </button>
        </div>
        {promoApplied && (
          <p className="text-green-600 text-[11px] mt-1">✓ WELCOMENOIR — 10% off applied!</p>
        )}
        {promoError && (
          <p className="text-red-500 text-[11px] mt-1">{promoError}</p>
        )}
      </div>

      <div className="border-t border-[#EADCDF] pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#6A6560]">Subtotal</span><span>{formatCurrency(subtotal)}</span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount (WELCOMENOIR)</span><span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-[#6A6560]">Shipping</span>
          <span className={shippingCost === 0 ? "text-green-600" : ""}>{shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#EADCDF]">
          <span>Total</span><span className="text-[#880A25]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFFF8] px-4 lg:px-10 py-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="font-display text-2xl font-semibold tracking-[0.2em] text-[#880A25]">NOIR</Link>
        <div className="flex items-center gap-2 text-[11px] text-[#6A6560]">
          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />SECURE CHECKOUT
        </div>
      </div>

      {/* Mobile order summary toggle */}
      <button
        onClick={() => setShowOrderSummary(!showOrderSummary)}
        className="lg:hidden w-full flex items-center justify-between bg-[#F8F7F5] border border-[#EADCDF] px-4 py-3 mb-6"
      >
        <span className="text-sm text-[#6A6560]">{showOrderSummary ? "Hide" : "Show"} order summary</span>
        <div className="flex items-center gap-2">
          <span className="text-[#880A25] font-medium">{formatCurrency(total)}</span>
          {showOrderSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

        {/* ─── LEFT: Form or Payment ─── */}
        <div>

          {step === "form" && (
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
              {/* Contact */}
              <section>
                <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-4 pb-3 border-b border-[#EADCDF]">CONTACT INFORMATION</h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="FIRST NAME" name="firstName" required half register={register} errors={errors} />
                  <InputField label="LAST NAME" name="lastName" required half register={register} errors={errors} />
                  <InputField label="EMAIL ADDRESS" name="email" type="email" required register={register} errors={errors} />
                  <InputField label="PHONE NUMBER" name="phone" type="tel" required register={register} errors={errors} />
                </div>
              </section>

              {/* Address */}
              <section>
                <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-4 pb-3 border-b border-[#EADCDF]">DELIVERY ADDRESS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="ADDRESS LINE 1" name="address1" required placeholder="Street address" register={register} errors={errors} />
                  <InputField label="ADDRESS LINE 2" name="address2" placeholder="Apt, suite, unit (optional)" register={register} errors={errors} />
                  <InputField label="CITY" name="city" required half register={register} errors={errors} />
                  <InputField label="STATE / PROVINCE" name="state" required half register={register} errors={errors} />
                  <InputField label="POSTAL CODE" name="postalCode" required half register={register} errors={errors} />
                  <div className="col-span-1">
                    <label className="block text-[10px] tracking-[0.15em] text-[#9A9590] mb-1.5">
                      COUNTRY <span className="text-[#880A25]">*</span>
                    </label>
                    <select
                      {...register("country")}
                      className="w-full bg-[#F8F7F5] border border-[#EADCDF] focus:border-[#880A25] text-[#2F1820] px-4 py-3 text-sm outline-none"
                    >
                      <option value="CA">Canada</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="NL">Netherlands</option>
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="NZ">New Zealand</option>
                      <option value="SG">Singapore</option>
                      <option value="AE">United Arab Emirates</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] mb-4 pb-3 border-b border-[#EADCDF]">SHIPPING METHOD</h2>
                <div className="space-y-2">
                  {shippingOptions.map((opt) => {
                    const price = subtotal >= FREE_SHIPPING_THRESHOLD && opt.id === "standard" ? 0 : opt.price;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                          selectedShipping === opt.id
                            ? "border-[#880A25] bg-[#FFF0F2]"
                            : "border-[#EADCDF] hover:border-[#C8A0A8]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="radio" value={opt.id} {...register("shippingMethod")} className="accent-[#880A25]" />
                          <div>
                            <p className="text-sm text-[#2F1820]">{opt.label}</p>
                            <p className="text-[11px] text-[#6A6560]">{opt.estimate}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${price === 0 ? "text-green-600" : "text-[#2F1820]"}`}>
                          {price === 0 ? "FREE" : formatCurrency(price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Legal */}
              <section className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register("ageConfirmation")} className="mt-0.5 accent-[#880A25]" />
                  <span className="text-[12px] text-[#6A6560] leading-relaxed">
                    I confirm that I am 19 years of age or older and legally permitted to purchase tobacco products in my jurisdiction.{" "}
                    <span className="text-[#880A25]">*</span>
                  </span>
                </label>
                {errors.ageConfirmation && <p className="text-red-500 text-[11px]">{errors.ageConfirmation.message}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register("agreeToTerms")} className="mt-0.5 accent-[#880A25]" />
                  <span className="text-[12px] text-[#6A6560] leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-[#880A25] hover:underline">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" className="text-[#880A25] hover:underline">Privacy Policy</Link>.{" "}
                    <span className="text-[#880A25]">*</span>
                  </span>
                </label>
                {errors.agreeToTerms && <p className="text-red-500 text-[11px]">{errors.agreeToTerms.message}</p>}
              </section>

              {/* Continue to payment */}
              <button
                type="submit"
                disabled={loadingPayment}
                className="flex items-center justify-center gap-3 w-full bg-[#880A25] hover:bg-[#6D0820] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 text-[11px] font-semibold tracking-[0.2em] transition-colors"
              >
                {loadingPayment ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>CONTINUE TO PAYMENT <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-[11px] text-[#6A6560] hover:text-[#880A25] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to details
              </button>

              <h2 className="text-[11px] tracking-[0.2em] text-[#9A9590] pb-3 border-b border-[#EADCDF]">PAYMENT</h2>

              {/* Payment method tabs */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPayMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[12px] font-medium tracking-[0.1em] transition-colors ${
                    payMethod === "card"
                      ? "border-[#880A25] bg-[#FFF0F2] text-[#880A25]"
                      : "border-[#EADCDF] text-[#6A6560] hover:border-[#C8A0A8]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" strokeWidth={1.8} />
                  CARD
                </button>
                <button
                  onClick={() => setPayMethod("paypal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[12px] font-medium tracking-[0.1em] transition-colors ${
                    payMethod === "paypal"
                      ? "border-[#880A25] bg-[#FFF0F2] text-[#880A25]"
                      : "border-[#EADCDF] text-[#6A6560] hover:border-[#C8A0A8]"
                  }`}
                >
                  <svg className="w-14 h-4" viewBox="0 0 100 24" fill="currentColor">
                    <text y="18" fontSize="18" fontWeight="bold">PayPal</text>
                  </svg>
                </button>
              </div>

              {payMethod === "card" && (
                <div className="bg-[#F0F7FF] border border-[#B0CCED] rounded-sm px-4 py-3 text-[11px] text-[#1A3A5C]">
                  <p className="font-bold mb-1.5">🧪 TEST MODE — Use these test cards:</p>
                  <div className="space-y-1 font-mono">
                    <p><span className="font-bold">Visa:</span> 4242 4242 4242 4242</p>
                    <p><span className="font-bold">Mastercard:</span> 5555 5555 5555 4444</p>
                    <p><span className="font-bold">Amex:</span> 3782 822463 10005</p>
                  </div>
                  <p className="mt-1.5 text-[#3A6A9C]">Any future expiry date · Any 3-digit CVC · Any postal code</p>
                </div>
              )}

              {payMethod === "card" && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#880A25",
                        colorBackground: "#FFFFFF",
                        colorText: "#2F1820",
                        borderRadius: "2px",
                        fontFamily: "system-ui, sans-serif",
                      },
                    },
                  }}
                >
                  <StripePayForm
                    orderId={pendingOrderId!}
                    total={total}
                    onBack={handleBack}
                  />
                </Elements>
              )}

              {payMethod === "paypal" && (
                <div className="space-y-3">
                  <p className="text-[12px] text-[#6A6560]">
                    Click below to complete your purchase securely via PayPal.
                  </p>
                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                      currency: "USD",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                      createOrder={createPayPalOrder}
                      onApprove={onPayPalApprove}
                      onError={() => toast.error("PayPal encountered an error. Please try again.")}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Security note */}
              <div className="flex items-center gap-2 text-[11px] text-[#9A9590] pt-2 border-t border-[#EADCDF]">
                <Lock className="w-3.5 h-3.5 text-[#880A25]" strokeWidth={1.5} />
                Payments are encrypted and processed securely. We never store your card details.
              </div>

              {/* Accepted cards */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#9A9590] tracking-[0.1em]">ACCEPTED</span>
                {["VISA", "MC", "AMEX", "DISC"].map((c) => (
                  <span key={c} className="px-2 py-1 border border-[#EADCDF] text-[9px] text-[#6A6560] font-bold tracking-wider">
                    {c === "MC" ? "MASTERCARD" : c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT: Order summary ─── */}
        <div className={`${showOrderSummary ? "block" : "hidden"} lg:block`}>
          <OrderSummary />
        </div>

      </div>
    </div>
  );
}
