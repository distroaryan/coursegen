"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, CreditCard, LayoutDashboard, LogOut } from "lucide-react";
import { useBillingStore } from "@/lib/store/billing-store";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const credits = useBillingStore((s) => s.credits);

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  // Credit color indicator
  const creditColor =
    credits > 60 ? "text-emerald-400" : credits > 20 ? "text-amber-400" : "text-red-400";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="w-full px-6 sm:px-10 lg:px-16 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
            C
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            CourseGen
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isPending ? (
            <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
          ) : !user ? (
            <button
              onClick={handleSignIn}
              className="group relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium h-10 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ) : (
            <div className="relative flex items-center gap-3">
              {/* Dashboard pill — desktop */}
              <Link
                href="/dashboard"
                className="text-sm font-medium px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer hidden sm:block"
              >
                Dashboard
              </Link>

              {/* Credit chip — visible when logged in */}
              <Link
                href="/billing"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all cursor-pointer group"
                title="Your credits"
              >
                <Zap className={`w-3.5 h-3.5 ${creditColor} group-hover:scale-110 transition-transform`} />
                <span className={`text-sm font-semibold tabular-nums ${creditColor}`}>{credits}</span>
              </Link>

              {/* Avatar button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 transition font-medium text-sm ring-2 ring-transparent hover:ring-indigo-500/40"
                aria-label="Toggle user menu"
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {/* ── Dropdown menu ── */}
              {isDropdownOpen && (
                <>
                  {/* Click-away overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={closeDropdown}
                  />
                  <div className="absolute right-0 top-full mt-2 w-60 p-1.5 rounded-xl border border-white/10 bg-[#111]/95 backdrop-blur-xl shadow-xl z-50">

                    {/* User info */}
                    <div className="px-3 py-3">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="h-px bg-white/[0.06] mx-2 mb-1" />

                    {/* Credit balance */}
                    <div className="mx-1.5 mb-1 rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap className={`w-3.5 h-3.5 ${creditColor}`} />
                          <span className="text-xs text-gray-400">Credits</span>
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${creditColor}`}>
                          {credits}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                          style={{ width: `${Math.min(100, credits)}%` }}
                        />
                      </div>
                    </div>

                    {/* Menu items */}
                    <Link
                      href="/dashboard"
                      onClick={closeDropdown}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-500" />
                      Dashboard
                    </Link>

                    <Link
                      href="/billing"
                      onClick={closeDropdown}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      Billing
                    </Link>

                    <div className="h-px bg-white/[0.06] mx-2 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
