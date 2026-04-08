import Stripe from "stripe";
import { env } from "@/env";

// Singleton pattern — reuse the same instance across hot reloads in dev
const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

export const stripe =
  globalForStripe.stripe ??
  new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;
