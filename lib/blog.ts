import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";
import type { ComponentType } from "react";
import {
  extractReadingMetricsFromMdx,
  type BlogReadingMetrics,
} from "@/lib/blog-reading";
import { extractTocFromMdx, type BlogTocItem } from "@/lib/blog-toc";
import { z } from "zod";

const blogMetadataSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  publishedAt: z.string().date(),
  tags: z.array(z.string().min(1)).min(1),
});

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "slug 仅允许小写字母、数字和连字符");

const blogModuleSchema = z.object({
  default: z.custom<ComponentType>(),
  metadata: blogMetadataSchema,
});

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_FILE_EXT = ".mdx";
const BLOG_CACHE_REVALIDATE_SECONDS = 60 * 60;

export const BLOG_LIST_CACHE_TAG = "blog-list";
const BLOG_POST_CACHE_TAG_PREFIX = "blog-post:";

type BlogMetadata = z.infer<typeof blogMetadataSchema>;

export type BlogPostSummary = BlogMetadata & {
  slug: string;
};

export type BlogPost = BlogPostSummary & {
  Content: ComponentType;
  toc: BlogTocItem[];
  reading: BlogReadingMetrics;
};

export type { BlogReadingMetrics } from "@/lib/blog-reading";
export type { BlogTocItem } from "@/lib/blog-toc";

export function getBlogPostCacheTag(slug: string) {
  return `${BLOG_POST_CACHE_TAG_PREFIX}${slug}`;
}

export function isValidBlogSlug(slug: string) {
  return slugSchema.safeParse(slug).success;
}

function sortByPublishedAtDesc(posts: BlogPostSummary[]) {
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

async function importBlogModule(slug: string) {
  const safeSlug = slugSchema.safeParse(slug);

  if (!safeSlug.success) {
    return null;
  }

  try {
    const mod = await import(`@/content/blog/${safeSlug.data}.mdx`);
    return blogModuleSchema.parse(mod);
  } catch {
    return null;
  }
}

async function readBlogSource(slug: string) {
  const safeSlug = slugSchema.safeParse(slug);

  if (!safeSlug.success) {
    return null;
  }

  const sourcePath = path.join(BLOG_DIR, `${safeSlug.data}${BLOG_FILE_EXT}`);

  try {
    return await readFile(sourcePath, "utf8");
  } catch {
    return null;
  }
}

function toSummary(slug: string, metadata: BlogMetadata): BlogPostSummary {
  return {
    slug,
    ...metadata,
  };
}

async function getAllBlogSlugsUncached() {
  const dirEntries = await readdir(BLOG_DIR, { withFileTypes: true });

  return dirEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(BLOG_FILE_EXT))
    .map((entry) => entry.name.slice(0, -BLOG_FILE_EXT.length))
    .filter((slug) => slugSchema.safeParse(slug).success)
    .sort();
}

const getAllBlogSlugsCached = unstable_cache(
  getAllBlogSlugsUncached,
  ["blog-slugs-v1"],
  {
    tags: [BLOG_LIST_CACHE_TAG],
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
  },
);

export async function getAllBlogSlugs() {
  return getAllBlogSlugsCached();
}

async function getAllBlogPostsUncached() {
  const slugs = await getAllBlogSlugsUncached();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const blogModule = await importBlogModule(slug);
      if (!blogModule) {
        return null;
      }
      return toSummary(slug, blogModule.metadata);
    }),
  );

  const validPosts = posts.filter(
    (post): post is BlogPostSummary => post !== null,
  );

  return sortByPublishedAtDesc(validPosts);
}

const getAllBlogPostsCached = unstable_cache(
  getAllBlogPostsUncached,
  ["blog-post-summaries-v1"],
  {
    tags: [BLOG_LIST_CACHE_TAG],
    revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
  },
);

export async function getAllBlogPosts() {
  return getAllBlogPostsCached();
}

async function getBlogPostSummaryBySlugUncached(slug: string) {
  const blogModule = await importBlogModule(slug);

  if (!blogModule) {
    return null;
  }

  return toSummary(slug, blogModule.metadata);
}

async function getBlogPostSummaryBySlug(slug: string) {
  const safeSlug = slugSchema.safeParse(slug);

  if (!safeSlug.success) {
    return null;
  }

  const parsedSlug = safeSlug.data;

  return unstable_cache(
    async () => getBlogPostSummaryBySlugUncached(parsedSlug),
    ["blog-post-summary-v1", parsedSlug],
    {
      tags: [BLOG_LIST_CACHE_TAG, getBlogPostCacheTag(parsedSlug)],
      revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    },
  )();
}

async function getBlogPostTocBySlugUncached(slug: string) {
  const source = await readBlogSource(slug);

  if (!source) {
    return [];
  }

  return extractTocFromMdx(source);
}

async function getBlogPostTocBySlug(slug: string) {
  const safeSlug = slugSchema.safeParse(slug);

  if (!safeSlug.success) {
    return [];
  }

  const parsedSlug = safeSlug.data;

  return unstable_cache(
    async () => getBlogPostTocBySlugUncached(parsedSlug),
    ["blog-post-toc-v1", parsedSlug],
    {
      tags: [BLOG_LIST_CACHE_TAG, getBlogPostCacheTag(parsedSlug)],
      revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    },
  )();
}

async function getBlogPostReadingBySlugUncached(slug: string) {
  const source = await readBlogSource(slug);

  if (!source) {
    return {
      wordCount: 0,
      readingMinutes: 1,
    } satisfies BlogReadingMetrics;
  }

  return extractReadingMetricsFromMdx(source);
}

async function getBlogPostReadingBySlug(slug: string) {
  const safeSlug = slugSchema.safeParse(slug);

  if (!safeSlug.success) {
    return {
      wordCount: 0,
      readingMinutes: 1,
    } satisfies BlogReadingMetrics;
  }

  const parsedSlug = safeSlug.data;

  return unstable_cache(
    async () => getBlogPostReadingBySlugUncached(parsedSlug),
    ["blog-post-reading-v1", parsedSlug],
    {
      tags: [BLOG_LIST_CACHE_TAG, getBlogPostCacheTag(parsedSlug)],
      revalidate: BLOG_CACHE_REVALIDATE_SECONDS,
    },
  )();
}

export async function getBlogPostBySlug(slug: string) {
  const safeSlug = slugSchema.safeParse(slug);

  if (!safeSlug.success) {
    return null;
  }

  const parsedSlug = safeSlug.data;
  const summary = await getBlogPostSummaryBySlug(parsedSlug);

  if (!summary) {
    return null;
  }

  const [blogModule, toc, reading] = await Promise.all([
    importBlogModule(parsedSlug),
    getBlogPostTocBySlug(parsedSlug),
    getBlogPostReadingBySlug(parsedSlug),
  ]);

  if (!blogModule) {
    return null;
  }

  return {
    ...summary,
    Content: blogModule.default,
    toc,
    reading,
  } as BlogPost;
}
