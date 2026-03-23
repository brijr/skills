/**
 * Design System — Tailwind Variant
 * @file ds.tsx
 * @description Layout primitives and prose typography for structuring pages.
 * @dependencies clsx, tailwind-merge
 * @variant tailwind
 *
 * Install: npm install clsx tailwind-merge
 * Import: import { Section, Container, Prose } from "@/components/ds"
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Merge class names with Tailwind-aware deduplication. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type DSProps = {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
};

type NavProps = DSProps & {
  /** Class names for the inner container div. */
  containerClassName?: string;
};

type ProseProps = DSProps & {
  /** Render as <article> with max-w-prose. */
  isArticle?: boolean;
  /** Add vertical spacing between children and heading margins. */
  isSpaced?: boolean;
  dangerouslySetInnerHTML?: { __html: string };
};

// ---------------------------------------------------------------------------
// Layout Primitives
// ---------------------------------------------------------------------------

/** Root HTML wrapper. Use in root layout.tsx. Sets scroll-smooth and antialiased. */
export const Layout = ({ children, className, style }: DSProps) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn("scroll-smooth antialiased focus:scroll-auto", className)}
    style={style}
  >
    {children}
  </html>
);

/** Primary content area. Semantic <main> hook with minimal defaults. */
export const Main = ({ children, className, id, style }: DSProps) => (
  <main className={cn(className)} id={id} style={style}>
    {children}
  </main>
);

/** Semantic section with responsive vertical padding. */
export const Section = ({ children, className, id, style }: DSProps) => (
  <section className={cn("py-2 sm:py-4", className)} id={id} style={style}>
    {children}
  </section>
);

/** Centered content wrapper with max-width and responsive padding. */
export const Container = ({ children, className, id, style }: DSProps) => (
  <div
    className={cn("max-w-5xl mx-auto p-4 sm:p-6", className)}
    id={id}
    style={style}
  >
    {children}
  </div>
);

/** Navigation bar with an inner centered container. */
export const Nav = ({
  children,
  className,
  id,
  style,
  containerClassName,
}: NavProps) => (
  <nav className={cn(className)} id={id} style={style}>
    <div
      className={cn(
        "max-w-5xl mx-auto px-4 sm:px-6 py-2",
        containerClassName
      )}
    >
      {children}
    </div>
  </nav>
);

// ---------------------------------------------------------------------------
// Prose — Content Typography
// ---------------------------------------------------------------------------

/** Rich typography system for rendered content (markdown, articles, AI output). */
export const Prose = ({
  children,
  className,
  id,
  dangerouslySetInnerHTML,
  style,
  isArticle = false,
  isSpaced = false,
}: ProseProps) => {
  const Component = isArticle ? "article" : "div";

  return (
    <Component
      className={cn(
        // Base
        "antialiased text-base leading-7",

        // Headings
        "[&_h1]:text-4xl sm:[&_h1]:text-5xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h1]:text-balance",
        "[&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-balance",
        "[&_h3]:text-2xl sm:[&_h3]:text-3xl [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:text-balance",
        "[&_h4]:text-xl sm:[&_h4]:text-2xl [&_h4]:tracking-tight [&_h4]:text-balance",
        "[&_h5]:text-lg sm:[&_h5]:text-xl [&_h5]:tracking-tight [&_h5]:text-balance",
        "[&_h6]:text-base sm:[&_h6]:text-lg [&_h6]:tracking-tight [&_h6]:text-balance",

        // Paragraphs & inline
        "[&_p]:text-pretty [&_p]:text-base",
        "[&_strong]:font-semibold",
        "[&_em]:italic",
        "[&_del]:line-through",

        // Links (skip headings)
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:text-primary",
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:no-underline",
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:hover:underline",
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:underline-offset-2",
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:decoration-primary/50",
        "[&_a:not(h1_a,h2_a,h3_a,h4_a,h5_a,h6_a)]:transition-all",

        // Unordered lists (custom bullets)
        "[&_ul]:pl-0 [&_ul]:py-3 [&_ul]:list-none [&_ul]:space-y-1",
        "[&_ul>li]:relative [&_ul>li]:pl-6",
        "[&_ul>li]:before:absolute [&_ul>li]:before:left-1 [&_ul>li]:before:top-[0.6875em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-foreground/80 [&_ul>li]:before:content-['']",
        "[&_ul>ul>li]:before:bg-foreground/60",
        "[&_ul>ul>ul>li]:before:bg-foreground/40",

        // Ordered lists
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:py-3 [&_ol]:space-y-1",
        "[&_ol>ol]:list-[lower-alpha]",
        "[&_ol>ol>ol]:list-[lower-roman]",

        // List items
        "[&_li]:pl-2 [&_li]:marker:text-foreground/80",
        "[&_li>ul]:mt-2 [&_li>ul]:mb-0 [&_li>ol]:mt-2 [&_li>ol]:mb-0",

        // Inline code
        "[&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:border [&_code:not(pre_code)]:bg-muted/50 [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-px [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_code:not(pre_code)]:font-medium",

        // Code blocks
        "[&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:my-4",
        "[&_pre>code]:bg-transparent [&_pre>code]:p-0",

        // Tables
        "[&_table]:w-full [&_table]:my-4 [&_table]:overflow-hidden [&_table]:rounded-sm [&_table]:border",
        "[&_thead]:bg-muted/50",
        "[&_tr]:border-b [&_tr:nth-child(even)]:bg-muted/20",
        "[&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:border-r",
        "[&_td]:px-4 [&_td]:py-2 [&_td]:border-r",

        // Media
        "[&_img]:border [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-sm",
        "[&_video]:border [&_video]:my-4 [&_video]:max-w-full [&_video]:h-auto [&_video]:rounded-sm",

        // Block elements
        "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4! [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground [&_blockquote]:bg-muted/30",
        "[&_hr]:my-8! [&_hr]:border-t-2 [&_hr]:border-border/50",

        // Article mode
        isArticle && "max-w-prose",

        // Spaced mode
        isSpaced && "space-y-6",
        isSpaced &&
          "[&_h1:not(:first-child)]:mt-8 [&_h1]:mb-4 [&_h2:not(:first-child)]:mt-8 [&_h2]:mb-4",
        isSpaced &&
          "[&_h3:not(:first-child)]:mt-6 [&_h3]:mb-3 [&_h4:not(:first-child)]:mt-6 [&_h4]:mb-3",
        isSpaced &&
          "[&_h5:not(:first-child)]:mt-6 [&_h5]:mb-2 [&_h6:not(:first-child)]:mt-4 [&_h6]:mb-2",

        className
      )}
      id={id}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      style={style}
    >
      {children}
    </Component>
  );
};
