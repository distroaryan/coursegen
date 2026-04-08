/**
 * Zustand billing store with localStorage persistence.
 * Tracks credits, plan, and purchase history.
 * Credits default to 100 for new users.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number; // in USD
  priceId: string; // Stripe price lookup key
  popular?: boolean;
  description: string;
  perCredit: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 4.99,
    priceId: "starter_50",
    description: "Perfect for trying out course generation",
    perCredit: "$0.10 / credit",
  },
  {
    id: "growth",
    name: "Growth",
    credits: 150,
    price: 12.99,
    popular: true,
    priceId: "growth_150",
    description: "Best value for regular learners",
    perCredit: "$0.087 / credit",
  },
  {
    id: "pro",
    name: "Pro",
    credits: 400,
    price: 29.99,
    priceId: "pro_400",
    description: "For power users and teams",
    perCredit: "$0.075 / credit",
  },
];

export interface PurchaseRecord {
  id: string;
  credits: number;
  amount: number;
  packName: string;
  date: string;
}

interface BillingState {
  credits: number;
  purchases: PurchaseRecord[];
  addCredits: (amount: number, record?: Omit<PurchaseRecord, "id" | "date">) => void;
  deductCredits: (amount: number) => boolean; // returns false if insufficient
  setCredits: (amount: number) => void;
  hasEnoughCredits: (amount: number) => boolean;
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      credits: 100, // new users start with 100 free credits
      purchases: [],

      addCredits: (amount, record) => {
        set((state) => ({
          credits: state.credits + amount,
          purchases: record
            ? [
                {
                  id: crypto.randomUUID(),
                  date: new Date().toISOString(),
                  ...record,
                },
                ...state.purchases,
              ]
            : state.purchases,
        }));
      },

      deductCredits: (amount) => {
        const { credits } = get();
        if (credits < amount) return false;
        set((state) => ({ credits: state.credits - amount }));
        return true;
      },

      setCredits: (amount) => set({ credits: amount }),

      hasEnoughCredits: (amount) => get().credits >= amount,
    }),
    {
      name: "coursegen-billing",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
