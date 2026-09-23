import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(stripeKey ?? "placeholder_key_set_in_env", {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
});
