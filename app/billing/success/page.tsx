"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useBillingStore } from "@/lib/store/billing-store";
import { toast } from "sonner";

// Inner component that reads search params
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addCredits } = useBillingStore();
  const applied = useRef(false);

  const credits = Number(searchParams.get("credits") ?? 0);
  const pack = searchParams.get("pack") ?? "Credits";
  const amount = Number(searchParams.get("amount") ?? 0);

  useEffect(() => {
    // Guard: only apply once even in strict mode double-invoke
    if (applied.current || !credits) return;
    applied.current = true;

    addCredits(credits, {
      credits,
      amount,
      packName: pack,
    });

    toast.success(`${credits} credits added to your account!`);
  }, [credits, pack, amount, addCredits]);

  if (!credits) {
    // Invalid success page — redirect
    router.replace("/billing");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.07),transparent_60%)] pointer-events-none" />

      <div className="relative text-center max-w-md w-full">
        {/* Animated check */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            {/* Ring pulse */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-30" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Payment successful!</h1>
        <p className="text-gray-400 mb-8">
          Your credits have been added to your account.
        </p>

        {/* Credit summary */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Credits added</p>
              <p className="text-3xl font-black text-indigo-400 tabular-nums">+{credits}</p>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-white/[0.06] flex justify-between text-sm">
            <span className="text-gray-500">Pack</span>
            <span className="text-white font-medium">{pack}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Amount charged</span>
            <span className="text-white font-medium">${(amount / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/billing"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            View Billing
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense since useSearchParams requires it
export default function BillingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
