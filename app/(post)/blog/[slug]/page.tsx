import type { Metadata } from "next";
import { CalendarDays, Clock3, Tags } from "lucide-react";
import { notFound } from "next/navigation";
import { PostToc } from "@/components/blog/post-toc";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";
import { toAbsoluteUrl } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = toAbsoluteUrl(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const Content = post.Content;
  const contentClassName =
    post.toc.length > 0
      ? "mdx-content min-w-0 lg:col-start-1 lg:row-start-1"
      : "mdx-content min-w-0";
  const canonicalUrl = toAbsoluteUrl(`/blog/${post.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Yuran",
    },
    publisher: {
      "@type": "Person",
      name: "Yuran",
    },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    keywords: post.tags.join(", "),
    inLanguage: "zh-CN",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="space-y-10">
        <header className="space-y-4 border-b border-gray-200 pb-8 dark:border-gray-800">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Blog Post
          </p>
          <h1 className="max-w-[28ch] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-[65ch] text-base leading-7 text-gray-600 dark:text-gray-300">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              <span>{post.publishedAt}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" className="h-4 w-4" />
              <span>
                {post.reading.readingMinutes} 分钟阅读 · {post.reading.wordCount} 字
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tags aria-hidden="true" className="h-4 w-4" />
              <span>{post.tags.join(" / ")}</span>
            </span>
          </div>
        </header>

        <div
          className={
            post.toc.length > 0
              ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10"
              : ""
          }
        >
          {post.toc.length > 0 ? <PostToc items={post.toc} /> : null}

          <section className={contentClassName}>
            <Content />
          </section>
        </div>
      </article>
    </>
  );
}
