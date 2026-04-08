"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  CourseForm,
  type CourseFormData,
} from "@/components/create-course/CourseForm";
import { ChapterReview } from "@/components/create-course/ChapterReview";
import { generateCourseAction } from "@/app/actions/generate-course";
import { useRouter } from "next/navigation";
import { useBillingStore } from "@/lib/store/billing-store";

export default function CreateCoursePage() {
  const [step, setStep] = useState<"form" | "chapters">("form");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
  });
  const [chapters, setChapters] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { deductCredits, hasEnoughCredits } = useBillingStore();

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const handleFormSubmit = async (data: CourseFormData) => {
    if (!hasEnoughCredits(10)) {
      toast.error("Not enough credits to generate a course.");
      router.push("/billing");
      return;
    }

    setFormData(data);
    setIsGenerating(true);
    setError(null);

    try {
      const res = await generateCourseAction(data);
      if (!res.success) {
        setError(res.error || "Something went wrong.");
        toast.error(res.error || "Failed to generate course.");
        setIsGenerating(false);
      } else {
        deductCredits(10);
        toast.success(
          "Course generation queued. Your course will be available soon!",
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 3500);
      }
    } catch {
      setError("Failed to generate course. Please try again.");
      toast.error("Failed to generate course. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleGoBack = () => {
    setChapters([]);
    setStep("form");
  };

  const handleStartGenerating = () => {
    console.log("Starting course generation:", { formData, chapters });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-200 font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.10),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.06),transparent_70%)] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 z-10">
        {/* Back link */}
        <div className="w-full max-w-xl mb-8">
          <Link
            href="/dashboard"
            className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Card wrapper */}
        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          {/* Header banner */}
          <div className="h-32 bg-gradient-to-br from-blue-600/30 to-indigo-800/30 flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>

          {/* Body */}
          <div className="p-8 sm:p-10">
            {step === "form" && (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                  Create New Course
                </h1>
                <p className="text-slate-400 text-sm mb-8">
                  Give your course a title and a short description. The AI will
                  handle the rest.
                </p>
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <CourseForm
                  initialData={formData}
                  onSubmit={handleFormSubmit}
                  isLoading={isGenerating}
                />
              </>
            )}

            {step === "chapters" && (
              <ChapterReview
                title={formData.title}
                chapters={chapters}
                onGoBack={handleGoBack}
                onStartGenerating={handleStartGenerating}
              />
            )}
          </div>
        </div>

        {/* Decorative hint */}
        <p className="mt-6 text-xs text-slate-600 text-center max-w-md">
          {step === "form"
            ? "Courses are generated using AI and can be customised after creation."
            : "Chapter content will be generated using AI once you start."}
        </p>
      </main>
    </div>
  );
}
