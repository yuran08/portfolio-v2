import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "@/lib/blog";

export const alt = "Yuran Blog post preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const title = post?.title ?? "Yuran Blog";
  const excerpt =
    post?.excerpt ?? "Personal blog about Next.js, frontend engineering, and product building.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background:
            "linear-gradient(135deg, rgb(243, 244, 246) 0%, rgb(229, 231, 235) 45%, rgb(209, 213, 219) 100%)",
          color: "#111827",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4b5563",
          }}
        >
          Yuran Blog
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#374151",
              lineHeight: 1.4,
            }}
          >
            {excerpt}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
