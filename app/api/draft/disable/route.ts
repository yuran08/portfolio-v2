import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { parseDraftSecretEnv } from "@/lib/env";
import { safeEqual } from "@/lib/security";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const configuredSecret = parseDraftSecretEnv().BLOG_DRAFT_SECRET;

  if (!configuredSecret) {
    return new Response("Draft secret is not configured", { status: 500 });
  }

  if (!safeEqual(secret, configuredSecret)) {
    return new Response("Invalid token", { status: 401 });
  }

  const draft = await draftMode();
  draft.disable();

  redirect("/blog");
}
