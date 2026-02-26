import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const rehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-default",
  },
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [["rehype-pretty-code", rehypePrettyCodeOptions], "rehype-slug"],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);
