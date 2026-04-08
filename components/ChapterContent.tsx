import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeMarkdown } from "@/lib/sanitize-content";

interface ChapterContentProps {
  content: string;
}

export function ChapterContent({ content }: ChapterContentProps) {
  const clean = sanitizeMarkdown(content);

  return (
    <article
      className={[
        // Base prose reset
        "prose prose-invert max-w-none break-words",

        // ── Headings ──────────────────────────────────────────
        "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white",
        // h1
        "prose-h1:text-3xl prose-h1:mt-14 prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b prose-h1:border-white/10",
        // h2 — main section breaks, generous top spacing
        "prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/[0.07]",
        // h3 — subsections
        "prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4",
        // h4
        "prose-h4:text-base prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-gray-300",

        // ── Paragraphs ─────────────────────────────────────────
        // Extra line-height + generous vertical gap between paragraphs
        "prose-p:text-gray-300 prose-p:leading-[1.85] prose-p:my-5 prose-p:text-[1.0625rem]",

        // ── Lists ──────────────────────────────────────────────
        "prose-ul:my-6 prose-ul:space-y-2 prose-ol:my-6 prose-ol:space-y-2",
        "prose-li:text-gray-300 prose-li:leading-relaxed prose-li:my-1",
        "prose-li:marker:text-indigo-400",

        // ── Strong / em ────────────────────────────────────────
        "prose-strong:text-white prose-strong:font-semibold",
        "prose-em:text-gray-200 prose-em:italic",

        // ── Inline code ────────────────────────────────────────
        "prose-code:text-purple-300 prose-code:bg-purple-950/40 prose-code:border prose-code:border-purple-500/20",
        "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.875em] prose-code:break-words",
        // Suppress backtick pseudo-content that prose adds around inline code
        "prose-code:before:content-none prose-code:after:content-none",

        // ── Code blocks ────────────────────────────────────────
        "prose-pre:my-8 prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10",
        "prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-lg",
        "prose-pre:text-sm prose-pre:leading-relaxed",
        // Remove inline code styles inside pre (code blocks)
        "[&_pre_code]:bg-transparent [&_pre_code]:border-none [&_pre_code]:p-0 [&_pre_code]:text-inherit",

        // ── Blockquotes ────────────────────────────────────────
        "prose-blockquote:my-8 prose-blockquote:border-l-4 prose-blockquote:border-indigo-500/60",
        "prose-blockquote:bg-indigo-950/20 prose-blockquote:rounded-r-xl",
        "prose-blockquote:pl-5 prose-blockquote:py-3 prose-blockquote:pr-4",
        "prose-blockquote:text-gray-400 prose-blockquote:not-italic",

        // ── Tables ─────────────────────────────────────────────
        "prose-table:my-8 prose-table:w-full prose-table:border-collapse",
        "prose-th:text-white prose-th:font-semibold prose-th:bg-white/5 prose-th:border prose-th:border-white/10 prose-th:px-4 prose-th:py-2.5",
        "prose-td:text-gray-300 prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2.5",
        "prose-tr:even:bg-white/[0.02]",

        // ── Links ──────────────────────────────────────────────
        "prose-a:text-indigo-400 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-indigo-400/40",
        "hover:prose-a:text-indigo-300 hover:prose-a:decoration-indigo-300/60",

        // ── Horizontal rule ────────────────────────────────────
        "prose-hr:my-12 prose-hr:border-white/10",

        // ── Images / iframes ───────────────────────────────────
        "prose-img:rounded-xl prose-img:border prose-img:border-white/10",
        "[&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:border [&_iframe]:border-white/10 [&_iframe]:my-8",
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── Headings: add explicit top-margin via wrapper div so the
          //    first heading in a chapter never hugs the video/title above it
          h2: ({ children, ...props }) => (
            <h2 className="mt-14 mb-5" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mt-10 mb-4" {...props}>
              {children}
            </h3>
          ),

          // ── Paragraphs: explicit margin so nothing collapses
          p: ({ children, ...props }) => (
            <p className="my-5 leading-[1.85] text-gray-300 text-[1.0625rem]" {...props}>
              {children}
            </p>
          ),

          // ── Code block wrapper with a subtle header bar
          pre: ({ children, ...props }) => (
            <div className="my-8 rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c, opacity: 0.6 }}
                  />
                ))}
              </div>
              <pre className="p-5 overflow-x-auto bg-[#0d1117] text-sm leading-relaxed m-0 rounded-none border-none" {...props}>
                {children}
              </pre>
            </div>
          ),

          // ── Images: wrapped in a styled container
          img: ({ src, alt, ...props }) => (
            <span className="block my-8 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-auto object-cover"
                src={src}
                alt={alt || ""}
                loading="lazy"
                {...props}
              />
            </span>
          ),

          // ── Links: always open externally
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-400/40 hover:decoration-indigo-300/60 transition-colors"
              {...props}
            >
              {children}
            </a>
          ),

          // ── Blockquote: styled callout
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-8 border-l-4 border-indigo-500/60 bg-indigo-950/20 rounded-r-xl pl-5 py-3 pr-4 text-gray-400 not-italic"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // ── Horizontal rule
          hr: () => <hr className="my-12 border-white/10" />,
        }}
      >
        {clean}
      </ReactMarkdown>
    </article>
  );
}
