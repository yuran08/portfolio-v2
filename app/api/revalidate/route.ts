import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import {
  BLOG_LIST_CACHE_TAG,
  getBlogPostCacheTag,
  isValidBlogSlug,
} from "@/lib/blog";
import { parseDraftSecretEnv, parseRevalidateSecretEnv } from "@/lib/env";
import { safeEqual } from "@/lib/security";

type RevalidateScope = {
  paths: string[];
  tags: string[];
};

type RevalidateInput = {
  pathInput: string | null;
  secret: string | null;
  slugInput: string | null;
  tags: string[];
  typeInput: "layout" | "page" | null;
};

function normalizeBlogSlug(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  let slug = trimmed;

  if (slug.startsWith("/blog/")) {
    slug = slug.slice("/blog/".length);
  } else if (slug.startsWith("blog/")) {
    slug = slug.slice("blog/".length);
  }

  if (slug.includes("/")) {
    return null;
  }

  return isValidBlogSlug(slug) ? slug : null;
}

function isSafePath(path: string) {
  return (
    path.startsWith("/") && !path.startsWith("//") && path.length <= 1024
  );
}

function pushUnique(list: string[], value: string) {
  if (!list.includes(value)) {
    list.push(value);
  }
}

function asRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function splitTags(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeTags(tags: string[]) {
  const uniqueTags = new Set<string>();

  for (const tag of tags) {
    const trimmed = tag.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.length > 256) {
      return null;
    }

    uniqueTags.add(trimmed);
  }

  return [...uniqueTags];
}

function parseTypeInput(rawType: string | null) {
  if (!rawType) {
    return null;
  }

  if (rawType === "page" || rawType === "layout") {
    return rawType;
  }

  return null;
}

function getSecretFromHeaders(headers: Headers) {
  const directSecret =
    headers.get("x-revalidate-secret") ??
    headers.get("x-webhook-secret") ??
    headers.get("x-api-key");

  if (directSecret) {
    return directSecret;
  }

  const authorization = headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return null;
}

function extractSlugFromBody(body: Record<string, unknown>) {
  const directSlug = toStringOrNull(body.slug);
  if (directSlug) {
    return directSlug;
  }

  if (asRecord(body.slug)) {
    const nestedSlug = toStringOrNull(body.slug.current);
    if (nestedSlug) {
      return nestedSlug;
    }
  }

  if (asRecord(body.data)) {
    const dataSlug = toStringOrNull(body.data.slug);
    if (dataSlug) {
      return dataSlug;
    }

    if (asRecord(body.data.slug)) {
      const nestedDataSlug = toStringOrNull(body.data.slug.current);
      if (nestedDataSlug) {
        return nestedDataSlug;
      }
    }
  }

  return null;
}

function parseBodyInput(body: unknown) {
  if (!asRecord(body)) {
    return {
      pathInput: null,
      secret: null,
      slugInput: null,
      tags: [],
      typeInput: null,
    } satisfies RevalidateInput;
  }

  const type = parseTypeInput(toStringOrNull(body.type));
  const tags = [
    ...splitTags(toStringOrNull(body.tag)),
    ...splitTags(toStringOrNull(body.tags)),
    ...(Array.isArray(body.tags)
      ? body.tags
          .map((value) => (typeof value === "string" ? value : ""))
          .filter(Boolean)
      : []),
  ];

  return {
    pathInput: toStringOrNull(body.path),
    secret: toStringOrNull(body.secret),
    slugInput: extractSlugFromBody(body),
    tags,
    typeInput: type,
  } satisfies RevalidateInput;
}

async function parseRevalidateInput(request: NextRequest): Promise<RevalidateInput | Response> {
  const { searchParams } = request.nextUrl;
  let bodyInput: RevalidateInput = {
    pathInput: null,
    secret: null,
    slugInput: null,
    tags: [],
    typeInput: null,
  };

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      try {
        const body = await request.json();
        bodyInput = parseBodyInput(body);
      } catch {
        return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
      }
    }
  }

  const rawType = bodyInput.typeInput ?? parseTypeInput(searchParams.get("type"));

  if (searchParams.get("type") && !rawType) {
    return Response.json({ ok: false, error: "Invalid type" }, { status: 400 });
  }

  const tags = normalizeTags([
    ...bodyInput.tags,
    ...searchParams.getAll("tag").flatMap((tag) => splitTags(tag)),
    ...splitTags(searchParams.get("tags")),
  ]);

  if (!tags) {
    return Response.json({ ok: false, error: "Invalid tag" }, { status: 400 });
  }

  return {
    pathInput: bodyInput.pathInput ?? searchParams.get("path"),
    secret:
      bodyInput.secret ??
      searchParams.get("secret") ??
      getSecretFromHeaders(request.headers),
    slugInput: bodyInput.slugInput ?? searchParams.get("slug"),
    tags,
    typeInput: rawType,
  };
}

function revalidateBlogIndex(scope: RevalidateScope) {
  revalidatePath("/blog");
  revalidateTag(BLOG_LIST_CACHE_TAG, "max");
  pushUnique(scope.paths, "/blog");
  pushUnique(scope.tags, BLOG_LIST_CACHE_TAG);
}

function revalidateSlug(slug: string, scope: RevalidateScope) {
  const path = `/blog/${slug}`;
  const tag = getBlogPostCacheTag(slug);

  revalidatePath(path);
  revalidateTag(tag, "max");

  pushUnique(scope.paths, path);
  pushUnique(scope.tags, tag);
}

async function handleRevalidate(request: NextRequest) {
  const input = await parseRevalidateInput(request);

  if (input instanceof Response) {
    return input;
  }

  const { pathInput, secret, slugInput, tags, typeInput } = input;
  const { BLOG_REVALIDATE_SECRET } = parseRevalidateSecretEnv();
  const configuredSecret =
    BLOG_REVALIDATE_SECRET ?? parseDraftSecretEnv().BLOG_DRAFT_SECRET;

  if (!configuredSecret) {
    return Response.json(
      {
        ok: false,
        error:
          "BLOG_REVALIDATE_SECRET is not configured (fallback BLOG_DRAFT_SECRET is also missing)",
      },
      { status: 500 },
    );
  }

  if (!safeEqual(secret, configuredSecret)) {
    return Response.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  const scope: RevalidateScope = { paths: [], tags: [] };

  if (slugInput) {
    const slug = normalizeBlogSlug(slugInput);
    if (!slug) {
      return Response.json({ ok: false, error: "Invalid slug" }, { status: 400 });
    }
    revalidateSlug(slug, scope);
  }

  if (pathInput) {
    if (!isSafePath(pathInput)) {
      return Response.json({ ok: false, error: "Invalid path" }, { status: 400 });
    }

    if (typeInput) {
      revalidatePath(pathInput, typeInput);
      pushUnique(scope.paths, `${pathInput} (${typeInput})`);
    } else {
      revalidatePath(pathInput);
      pushUnique(scope.paths, pathInput);
    }
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
    pushUnique(scope.tags, tag);
  }

  if (scope.paths.length === 0 && scope.tags.length === 0) {
    revalidateBlogIndex(scope);
  } else if (!scope.tags.includes(BLOG_LIST_CACHE_TAG)) {
    revalidateBlogIndex(scope);
  }

  return Response.json({
    ok: true,
    revalidated: scope,
    now: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}
