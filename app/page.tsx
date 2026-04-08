import { Navbar } from "@/components/Navbar";
import {
  ArrowRight,
  Zap,
  BookOpen,
  Brain,
  BarChart3,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-200 font-sans">
      <Navbar />

      {/* ═══════════════════════════════════════════  HERO  ═══════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center text-center px-6 pt-32 pb-40 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.08),transparent_70%)] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-gray-400 mb-8 uppercase tracking-widest font-medium">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Powered by AI
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl leading-[1.05] mb-8">
          Learn anything.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Powered by AI.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light">
          Generate complete, structured courses on any topic in seconds. From
          quantum physics to watercolor painting — our AI adapts to your
          learning style.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="group inline-flex items-center justify-center rounded-xl text-base font-medium transition-all duration-300 bg-white text-black hover:bg-gray-100 h-13 px-8 py-3.5 shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
          >
            Start Learning — Free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/course/c743ec58-f854-4a10-b883-227e9137f5f6?chapterId=f3843f05-6f49-4415-9077-24b9af34fefd"
            className="group inline-flex items-center justify-center rounded-xl text-base font-medium transition-all duration-300 border border-white/[0.15] text-gray-300 hover:text-white hover:border-white/30 h-13 px-8 py-3.5 hover:bg-white/[0.04]"
          >
            <PlayCircle className="w-4 h-4 mr-2 text-indigo-400 group-hover:scale-110 transition-transform" />
            Try Demo Course
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════  FEATURES  ═══════════════════════════════════════════ */}
      <section
        id="features"
        className="relative w-full px-6 sm:px-10 lg:px-16 py-32"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm text-indigo-400 uppercase tracking-widest font-semibold mb-4">
              Why CourseGen?
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              The smartest way to learn,
              <br className="hidden sm:block" /> built for the curious mind.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Generated Courses",
                desc: "Enter any topic and get a complete, structured course with chapters, explanations, and resources — in seconds.",
                gradient: "from-indigo-500/20 to-indigo-500/5",
                iconColor: "text-indigo-400",
              },
              {
                icon: BookOpen,
                title: "Learn Any Subject",
                desc: "From programming to philosophy, from cooking to calculus. Our AI generates expert-level content on virtually any topic.",
                gradient: "from-purple-500/20 to-purple-500/5",
                iconColor: "text-purple-400",
              },
              {
                icon: BarChart3,
                title: "Track Your Progress",
                desc: "Navigate through chapters at your own pace. Pick up exactly where you left off with automatic progress tracking.",
                gradient: "from-pink-500/20 to-pink-500/5",
                iconColor: "text-pink-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.04]"
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6">
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-[15px]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════  PRICING  ═══════════════════════════════════════════ */}
      <section
        id="pricing"
        className="relative w-full px-6 sm:px-10 lg:px-16 py-32"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-20">
            <p className="text-sm text-indigo-400 uppercase tracking-widest font-semibold mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Start free, scale when ready.
            </h2>
            <p className="text-gray-400 text-lg">
              No credit card required. Upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="flex flex-col p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
              <p className="text-sm text-gray-500 mb-6">For getting started</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "3 course generations",
                  "Basic AI model",
                  "Community support",
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2.5 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="cursor-pointer w-full py-3 rounded-xl border border-white/[0.1] text-sm font-medium text-white hover:bg-white/[0.04] transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro — highlighted */}
            <div className="flex flex-col p-8 rounded-2xl bg-white/[0.04] border border-indigo-500/30 relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-indigo-500/[0.08] to-transparent pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Popular
              </div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
                <p className="text-sm text-gray-500 mb-6">
                  For serious learners
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">$12</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Unlimited generations",
                    "GPT-4 powered content",
                    "Priority support",
                    "Progress analytics",
                  ].map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start text-sm text-gray-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2.5 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="cursor-pointer w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-sm font-medium text-white transition-colors shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                  Upgrade to Pro
                </button>
              </div>
            </div>

            {/* Team */}
            <div className="flex flex-col p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white mb-1">Team</h3>
              <p className="text-sm text-gray-500 mb-6">For organizations</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">$39</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Pro",
                  "Team management",
                  "Custom branding",
                  "API access",
                  "Dedicated support",
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gray-600 mr-2.5 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="cursor-pointer w-full py-3 rounded-xl border border-white/[0.1] text-sm font-medium text-white hover:bg-white/[0.04] transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════  FOOTER  ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] pt-16 pb-10">
        <div className="w-full px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                  C
                </div>
                <span className="font-semibold text-lg text-white">
                  CourseGen
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                AI-powered course generation for the curious mind. Learn
                anything, anytime.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "How it works", "Changelog"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © 2026 CourseGen Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "GitHub", "Discord"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
