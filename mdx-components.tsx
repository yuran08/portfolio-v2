import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Note, Warning } from "@/components/mdx/admonition";
import { MacCodeBlock } from "@/components/mdx/mac-code-block";

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  "data-language"?: string;
};
type PreProps = ComponentPropsWithoutRef<"pre"> & {
  "data-language"?: string;
};

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Code({ className, "data-language": dataLanguage, ...props }: CodeProps) {
  const isCodeBlock = className?.includes("language-") || Boolean(dataLanguage);

  if (isCodeBlock) {
    return <code className={className} data-language={dataLanguage} {...props} />;
  }

  return (
    <code
      className="rounded-md border border-gray-200/90 bg-gray-100/90 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-800 dark:border-gray-700/90 dark:bg-gray-800/90 dark:text-gray-100"
      {...props}
    />
  );
}

function Pre({ className, "data-language": dataLanguage, ...props }: PreProps) {
  if (dataLanguage) {
    return <MacCodeBlock language={dataLanguage} className={className} {...props} />;
  }

  return (
    <pre
      className="mt-8 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      {...props}
    />
  );
}

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-14 scroll-mt-24 text-2xl font-bold tracking-tight text-gray-900 first:mt-0 dark:text-gray-100 sm:text-3xl"
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      data-toc-heading="true"
      className={cn(
        "mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-gray-900 first:mt-0 dark:text-gray-100 sm:text-2xl",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      data-toc-heading="true"
      className={cn(
        "mt-10 scroll-mt-24 text-lg font-semibold tracking-tight text-gray-900 first:mt-0 dark:text-gray-100 sm:text-xl",
        className,
      )}
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-8 scroll-mt-24 border-l-[3px] border-blue-500/70 bg-blue-50/80 py-1 pl-3 text-base font-semibold text-gray-900 first:mt-0 dark:border-blue-400/70 dark:bg-blue-500/10 dark:text-gray-100"
      {...props}
    />
  ),
  h5: (props) => (
    <h5
      className="mt-7 scroll-mt-24 text-base font-semibold text-gray-900 first:mt-0 dark:text-gray-100"
      {...props}
    />
  ),
  h6: (props) => (
    <h6
      className="mt-6 scroll-mt-24 text-sm font-semibold uppercase tracking-wide text-gray-600 first:mt-0 dark:text-gray-300"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mt-4 max-w-[72ch] text-[15px] leading-8 text-gray-700 first:mt-0 dark:text-gray-200 sm:text-base"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mt-5 list-disc space-y-3 pl-6 text-[15px] text-gray-700 marker:text-gray-500 dark:text-gray-200 dark:marker:text-gray-400 sm:text-base"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 list-decimal space-y-3 pl-6 text-[15px] text-gray-700 marker:text-gray-500 dark:text-gray-200 dark:marker:text-gray-400 sm:text-base"
      {...props}
    />
  ),
  li: (props) => (
    <li className="leading-8 marker:font-medium [&>p]:first:mt-0" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-blue-700 underline decoration-blue-400 underline-offset-4 transition-colors hover:text-blue-800 dark:text-blue-300 dark:decoration-blue-500/70 dark:hover:text-blue-200"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-8 border-l-4 border-gray-300 bg-gray-50 py-3 pl-4 pr-4 italic text-gray-700 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-200"
      {...props}
    />
  ),
  hr: (props) => (
    <hr className="my-10 border-gray-200 dark:border-gray-700" {...props} />
  ),
  Note,
  Warning,
  code: Code,
  pre: Pre,
};

export function useMDXComponents(raws: MDXComponents = {}): MDXComponents {
  return {
    ...raws,
    ...components,
  };
}
