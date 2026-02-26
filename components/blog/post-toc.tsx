"use client";

import { useEffect, useState } from "react";
import type { BlogTocItem } from "@/lib/blog";

type PostTocProps = {
  items: BlogTocItem[];
};

// Keep active heading stable with sticky header offset and early section switching.
const TOC_OBSERVER_ROOT_MARGIN = "-96px 0px -65% 0px";
const TOC_OBSERVER_THRESHOLD = [0, 1];

function getHashId() {
  const hash = window.location.hash.slice(1);

  if (!hash) {
    return null;
  }

  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
}

function pickActiveHeadingId(
  headings: HTMLElement[],
  visibleIds: Set<string>,
  allowedIds: Set<string>,
) {
  const visibleHeadings = headings
    .filter((heading) => visibleIds.has(heading.id))
    .map((heading) => ({
      id: heading.id,
      top: heading.getBoundingClientRect().top,
    }))
    .sort((a, b) => a.top - b.top);

  if (visibleHeadings.length > 0) {
    return visibleHeadings[0].id;
  }

  const passedHeadings = headings
    .map((heading) => ({
      id: heading.id,
      top: heading.getBoundingClientRect().top,
    }))
    .filter((heading) => heading.top <= 120)
    .sort((a, b) => b.top - a.top);

  if (passedHeadings.length > 0) {
    return passedHeadings[0].id;
  }

  const hashId = getHashId();

  if (hashId && allowedIds.has(hashId)) {
    return hashId;
  }

  return headings[0]?.id ?? null;
}

function TocNav({
  items,
  activeId,
}: {
  items: BlogTocItem[];
  activeId: string | null;
}) {
  return (
    <nav aria-label="文章目录">
      <ol className="space-y-1.5">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "block rounded-md py-1.5 transition-colors",
                  item.depth === 3
                    ? "ml-3 border-l border-gray-200 pl-3 text-[13px] dark:border-gray-700"
                    : "text-sm",
                  isActive
                    ? "font-medium text-blue-700 dark:text-blue-300"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                ].join(" ")}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PostToc({ items }: PostTocProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const allowedIds = new Set(items.map((item) => item.id));
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('[data-toc-heading="true"]'),
    ).filter((heading) => allowedIds.has(heading.id));

    if (headings.length === 0) {
      return;
    }

    const visibleIds = new Set<string>();
    let frameId: number | null = null;

    const updateActiveId = () => {
      const nextId = pickActiveHeadingId(headings, visibleIds, allowedIds);

      if (!nextId) {
        return;
      }

      setActiveId((prevId) => (prevId === nextId ? prevId : nextId));
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveId();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;

          if (!id) {
            continue;
          }

          if (entry.isIntersecting) {
            visibleIds.add(id);
          } else {
            visibleIds.delete(id);
          }
        }

        scheduleUpdate();
      },
      {
        rootMargin: TOC_OBSERVER_ROOT_MARGIN,
        threshold: TOC_OBSERVER_THRESHOLD,
      },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    const handleScrollOrResize = () => {
      scheduleUpdate();
    };

    const handleHashChange = () => {
      scheduleUpdate();
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("hashchange", handleHashChange);

    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("hashchange", handleHashChange);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <details className="rounded-xl border border-gray-200/80 bg-gray-50/80 dark:border-gray-700/80 dark:bg-gray-900/40 lg:hidden">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
          文章目录
        </summary>
        <div className="border-t border-gray-200/80 px-4 py-3 dark:border-gray-700/80">
          <TocNav items={items} activeId={activeId} />
        </div>
      </details>

      <aside className="hidden lg:col-start-2 lg:row-start-1 lg:block lg:self-start lg:sticky lg:top-24">
        <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 px-4 py-4 dark:border-gray-700/80 dark:bg-gray-900/40">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            On this page
          </p>
          <TocNav items={items} activeId={activeId} />
        </div>
      </aside>
    </>
  );
}
