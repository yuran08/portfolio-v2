import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getBlogPostBySlug, isValidBlogSlug } from "@/lib/blog";

function parseBlogSlug(rawSlug: string) {
  const trimmed = rawSlug.trim();
  if (!trimmed) {
    return null;
  }

  let slug = trimmed;

  if (slug.startsWith("/blog/")) {
    slug = slug.slice("/blog/".length);
  } else if (slug.startsWith("blog/")) {
    slug = slug.slice("blog/".length);
  } else if (slug.startsWith("/")) {
    return null;
  }

  if (slug.includes("/") || !isValidBlogSlug(slug)) {
    return null;
  }

  return slug;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const rawSlug = searchParams.get("slug");
  const configuredSecret = process.env.BLOG_DRAFT_SECRET;

  if (!configuredSecret) {
    return new Response("Draft secret is not configured", { status: 500 });
  }

  const slug = rawSlug ? parseBlogSlug(rawSlug) : null;

  if (secret !== configuredSecret || !slug) {
    return new Response("Invalid token or slug", { status: 401 });
  }

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return new Response("Invalid slug", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/blog/${post.slug}`);
}
