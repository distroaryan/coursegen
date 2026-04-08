import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ChevronLeft } from "lucide-react";
import { CourseSidebar } from "@/components/CourseSidebar";
import { CourseSidebarDrawer } from "@/components/CourseSidebarDrawer";
import { db } from "@/lib/db";
import { courses, chapters as chaptersSchema } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import type { CourseData } from "@/lib/mock-course-data";
import { NextChapterButton } from "@/components/NextChapterButton";
import { ChapterContent } from "@/components/ChapterContent";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Badge } from "@/components/ui/badge";

// Cached DB lookups — revalidates every 60 s or when explicitly purged
const getCourseWithChapters = unstable_cache(
  async (courseId: string) => {
    const [courseRecord] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    if (!courseRecord) return null;

    const courseChapters = await db
      .select()
      .from(chaptersSchema)
      .where(eq(chaptersSchema.courseId, courseId))
      .orderBy(asc(chaptersSchema.order));

    return { courseRecord, courseChapters };
  },
  ["course-with-chapters"],
  { revalidate: 60, tags: ["course"] },
);


interface CoursePageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ chapterId?: string }>;
}

export default async function CoursePage({
  params,
  searchParams,
}: CoursePageProps) {
  const { courseId } = await params;
  const { chapterId } = await searchParams;

  const cached = await getCourseWithChapters(courseId);
  if (!cached) notFound();

  const { courseRecord, courseChapters } = cached;

  // Map DB data to CourseData structure
  const courseData: CourseData = {
    id: courseRecord.id,
    title: courseRecord.title,
    description: courseRecord.description || "",
    chapters: courseChapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      order: ch.order,
      content: ch.content || "",
      video_urls: ch.videoUrls || [],
    })),
  };

  const targetChapterId =
    chapterId || courseRecord.activeChapterId || courseData.chapters[0]?.id;

  const activeChapter = courseData.chapters.find(
    (ch) => ch.id === targetChapterId,
  );

  if (!activeChapter) {
    notFound();
  }

  const prevChapter = courseData.chapters.find(
    (ch) => ch.order === activeChapter.order - 1,
  );
  const nextChapter = courseData.chapters.find(
    (ch) => ch.order === activeChapter.order + 1,
  );

  const videoUrl = activeChapter.video_urls?.[0];
  const DEMO_COURSE_ID = "c743ec58-f854-4a10-b883-227e9137f5f6";
  const isDemoCourse = courseId === DEMO_COURSE_ID;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a0a0a] text-gray-200 font-sans relative selection:bg-purple-500/30 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_70%)] pointer-events-none" />

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        {/* ───────── Main Content ───────── */}
        <main className="flex-1 min-w-0 lg:w-3/4 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 w-full">
            {/* Back Navigation */}
            <div className="mb-8 flex items-center justify-between">
              <Link
                href={isDemoCourse ? "/" : "/dashboard"}
                className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {isDemoCourse ? "Back to Home" : "Back to Dashboard"}
              </Link>
              {isDemoCourse && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                >
                  Sign in to save progress →
                </Link>
              )}
            </div>

            {/* Chapter Title */}
            <div className="mb-6 w-full">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold break-words">
                Chapter {activeChapter.order} of {courseData.chapters.length}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1 tracking-tight break-words">
                {activeChapter.title}
              </h1>
            </div>

            {/* Video Player */}
            {videoUrl && (
              <VideoPlayer videoUrl={videoUrl} title={activeChapter.title} />
            )}

            {/* Markdown Content */}
            <ChapterContent content={activeChapter.content} />

            {/* ───────── Navigation Buttons ───────── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-14 pt-8 border-t border-white/10">
              {prevChapter ? (
                <Link
                  href={`/course/${courseId}?chapterId=${prevChapter.id}`}
                  className="cursor-pointer group flex items-center justify-between sm:justify-start gap-2 px-4 sm:px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                  <div className="text-right sm:text-left overflow-hidden min-w-0 w-full sm:w-auto">
                    <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500">
                      Previous
                    </span>
                    <span className="block truncate max-w-full sm:max-w-[160px]">
                      {prevChapter.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextChapter ? (
                <NextChapterButton
                  courseId={courseId}
                  chapterId={nextChapter.id}
                  chapterOrder={nextChapter.order}
                  chapterTitle={nextChapter.title}
                />
              ) : (
                <Badge
                  variant="outline"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600/20 border-emerald-500/30 text-emerald-300 text-sm font-medium w-full sm:w-auto text-center justify-center"
                >
                  🎉 Course Complete!
                </Badge>
              )}
            </div>
          </div>
        </main>

        {/* ───────── Desktop Sidebar ───────── */}
        <aside className="hidden md:block w-[280px] lg:w-[320px] shrink-0 sticky top-0 h-screen p-4 pl-0">
          <div className="h-full">
            <CourseSidebar
              courseData={courseData}
              activeChapter={activeChapter}
            />
          </div>
        </aside>
      </div>

      {/* ───────── Mobile Drawer ───────── */}
      <CourseSidebarDrawer
        courseData={courseData}
        activeChapter={activeChapter}
      />
    </div>
  );
}
