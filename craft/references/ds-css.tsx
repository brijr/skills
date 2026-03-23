/**
 * Design System — CSS Variant
 * @file ds.tsx
 * @description Layout primitives and prose typography for structuring pages.
 * @dependencies clsx
 * @variant css
 *
 * Install: npm install clsx
 * Import ds.css in your root layout or global stylesheet.
 * Import: import { Section, Container, Prose } from "@/components/ds"
 */

import { clsx, type ClassValue } from "clsx";

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Merge class names. No tailwind-merge needed — CSS classes don't conflict. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
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
  /** Render as <article> with max reading width. */
  isArticle?: boolean;
  /** Add vertical spacing between children and heading margins. */
  isSpaced?: boolean;
  dangerouslySetInnerHTML?: { __html: string };
};

// ---------------------------------------------------------------------------
// Layout Primitives
// ---------------------------------------------------------------------------

/** Root HTML wrapper. Use in root layout.tsx. */
export const Layout = ({ children, className, style }: DSProps) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn("ds-layout", className)}
    style={style}
  >
    {children}
  </html>
);

/** Primary content area. Semantic <main> hook. */
export const Main = ({ children, className, id, style }: DSProps) => (
  <main className={cn("ds-main", className)} id={id} style={style}>
    {children}
  </main>
);

/** Semantic section with vertical padding. */
export const Section = ({ children, className, id, style }: DSProps) => (
  <section className={cn("ds-section", className)} id={id} style={style}>
    {children}
  </section>
);

/** Centered content wrapper with max-width and padding. */
export const Container = ({ children, className, id, style }: DSProps) => (
  <div className={cn("ds-container", className)} id={id} style={style}>
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
  <nav className={cn("ds-nav", className)} id={id} style={style}>
    <div className={cn("ds-nav-container", containerClassName)}>{children}</div>
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
        "ds-prose",
        isArticle && "ds-prose--article",
        isSpaced && "ds-prose--spaced",
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
