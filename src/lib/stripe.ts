import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    })
  : null;

export function requireStripe() {
  if (!stripe) {
    throw new Error("Stripe is not configured.");
  }

  return stripe;
}
