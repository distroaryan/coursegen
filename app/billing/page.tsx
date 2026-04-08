"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Zap, CreditCard, History, CheckCircle2, Sparkles, ChevronRight, Loader2, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useBillingStore, CREDIT_PACKS } from "@/lib/store/billing-store";
import { toast } from "sonner";

export default function BillingPage() {
  const router = useRouter();
  const { credits, purchases } = useBillingStore();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handlePurchase(packId: string) {
    setLoadingPack(packId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          toast.error("Please sign in to purchase credits");
          router.push("/");
          return;
        }
        throw new Error(data.error ?? "Something went wrong");
      }

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoadingPack(null);
    }
  }

  // Credit health color
  const creditColor =
    credits > 60
      ? "text-emerald-400"
      : credits > 20
      ? "text-amber-400"
      : "text-red-400";

  const creditBg =
    credits > 60
      ? "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20"
      : credits > 20
      ? "from-amber-500/10 to-amber-500/5 border-amber-500/20"
      : "from-red-500/10 to-red-500/5 border-red-500/20";

  const usedPercent = Math.max(0, Math.min(100, 100 - credits));

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-200 font-sans">
      <Navbar />

      {/* Page ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-10 pt-28 pb-20 relative">

        {/* ── Header ── */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-medium mb-4">
            <CreditCard className="w-3.5 h-3.5" />
            Billing &amp; Credits
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Credits
          </h1>
          <p className="text-gray-400 mt-2">
            Each AI course generation costs <span className="text-white font-medium">10 credits</span>. Purchase more anytime.
          </p>
        </div>

        {/* ── Credit Balance Card ── */}
        <div className={`relative rounded-2xl bg-gradient-to-br ${creditBg} border p-8 mb-10 overflow-hidden`}>
          <div className="absolute right-6 top-6 opacity-10">
            <Zap className="w-24 h-24 text-current" />
          </div>
          <div className="relative">
            <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-widest">Available Credits</p>
            <div className="flex items-end gap-3 mb-6">
              <span className={`text-6xl font-black tabular-nums ${creditColor}`}>
                {credits}
              </span>
              <span className="text-gray-500 text-lg mb-2">credits</span>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Used this cycle</span>
                <span>{usedPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${100 - usedPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              💡 Tip: You can generate approximately{" "}
              <span className="text-gray-300 font-medium">{Math.floor(credits / 10)} courses</span> with your current balance.
            </p>
          </div>
        </div>

        {/* ── Credit Packs ── */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-2">Top up Credits</h2>
          <p className="text-sm text-gray-500 mb-6">One-time purchase, no subscription required.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`relative group flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
                  pack.popular
                    ? "bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.08)]"
                    : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04]"
                }`}
              >
                {pack.popular && (
                  <>
                    {/* Top glow line */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent rounded-t-2xl" />
                    {/* Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-indigo-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{pack.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{pack.description}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    pack.popular ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-gray-400"
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">${pack.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-semibold text-indigo-400">{pack.credits} credits</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{pack.perCredit}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-2 mb-6">
                  {[
                    `${Math.floor(pack.credits / 10)} full AI courses`,
                    "Never expires",
                    "Instant delivery",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${pack.popular ? "text-indigo-400" : "text-gray-600"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pack.priceId)}
                  disabled={loadingPack !== null}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    pack.popular
                      ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                      : "bg-white/[0.06] hover:bg-white/[0.10] text-gray-300 hover:text-white border border-white/[0.08]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPack === pack.priceId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting…
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Purchase
                      <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Purchase History ── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <History className="w-4 h-4 text-gray-500" />
            <h2 className="text-xl font-semibold text-white">Purchase History</h2>
          </div>

          {purchases.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-12 text-center">
              <Sparkles className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No purchases yet.</p>
              <p className="text-gray-600 text-xs mt-1">Your credit packs will appear here after checkout.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto] text-xs text-gray-600 uppercase tracking-widest px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <span>Pack</span>
                <span className="text-center pr-8">Credits</span>
                <span>Date</span>
              </div>
              {purchases.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{p.packName} Pack</p>
                    <p className="text-xs text-gray-500">
                      ${(p.amount / 100).toFixed(2)} · One-time
                    </p>
                  </div>
                  <div className="pr-8 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400">
                      <Zap className="w-3.5 h-3.5" />
                      +{p.credits}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <p className="text-xs text-gray-700 mt-8 text-center">
          Payments are processed securely. Credits never expire and can be used for any course generation.
        </p>
      </main>
    </div>
  );
}
