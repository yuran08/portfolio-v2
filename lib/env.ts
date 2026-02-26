import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  BLOG_DRAFT_SECRET: z.string().min(16).optional(),
  BLOG_REVALIDATE_SECRET: z.string().min(16).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

const siteEnvSchema = envSchema.pick({
  NEXT_PUBLIC_SITE_URL: true,
});

const draftSecretEnvSchema = envSchema.pick({
  BLOG_DRAFT_SECRET: true,
});

const revalidateSecretEnvSchema = envSchema.pick({
  BLOG_REVALIDATE_SECRET: true,
});

function formatEnvError(issues: z.ZodIssue[]) {
  return issues
    .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
}

export function parseEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
    BLOG_DRAFT_SECRET: source.BLOG_DRAFT_SECRET,
    BLOG_REVALIDATE_SECRET: source.BLOG_REVALIDATE_SECRET,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${formatEnvError(parsed.error.issues)}`);
  }

  return parsed.data;
}

export function parseSiteEnv(source: NodeJS.ProcessEnv = process.env) {
  const parsed = siteEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: source.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${formatEnvError(parsed.error.issues)}`);
  }

  return parsed.data;
}

export function parseDraftSecretEnv(source: NodeJS.ProcessEnv = process.env) {
  const parsed = draftSecretEnvSchema.safeParse({
    BLOG_DRAFT_SECRET: source.BLOG_DRAFT_SECRET,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${formatEnvError(parsed.error.issues)}`);
  }

  return parsed.data;
}

export function parseRevalidateSecretEnv(source: NodeJS.ProcessEnv = process.env) {
  const parsed = revalidateSecretEnvSchema.safeParse({
    BLOG_REVALIDATE_SECRET: source.BLOG_REVALIDATE_SECRET,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${formatEnvError(parsed.error.issues)}`);
  }

  return parsed.data;
}
