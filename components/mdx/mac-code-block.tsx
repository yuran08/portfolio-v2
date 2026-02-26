import type { ComponentPropsWithoutRef } from "react";

type MacCodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  language: string;
};

const PRE_BASE_CLASSES = [
  "m-0 bg-transparent p-0 text-sm",
  "[&>code]:grid [&>code]:min-w-max [&>code]:font-mono [&>code]:text-[0.92rem] [&>code]:leading-[1.68]",
  "[&>code>[data-line]]:block [&>code>[data-line]]:px-4",
  "[&>code>[data-line]>span]:text-[color:var(--shiki-light)]",
  "dark:[&>code>[data-line]>span]:text-[color:var(--shiki-dark)]",
  "[&>code>[data-highlighted-line]]:border-l-2 [&>code>[data-highlighted-line]]:border-cyan-600 [&>code>[data-highlighted-line]]:bg-cyan-600/12",
  "dark:[&>code>[data-highlighted-line]]:border-sky-400 dark:[&>code>[data-highlighted-line]]:bg-sky-400/14",
  "[&>code>[data-highlighted-chars]]:rounded [&>code>[data-highlighted-chars]]:bg-cyan-600/20 [&>code>[data-highlighted-chars]]:px-[0.2rem] [&>code>[data-highlighted-chars]]:py-[0.1rem]",
  "dark:[&>code>[data-highlighted-chars]]:bg-sky-400/24",
  "[&>code[data-line-numbers]]:[counter-reset:line]",
  "[&>code[data-line-numbers]>[data-line]::before]:mr-4 [&>code[data-line-numbers]>[data-line]::before]:inline-block [&>code[data-line-numbers]>[data-line]::before]:w-6 [&>code[data-line-numbers]>[data-line]::before]:text-right [&>code[data-line-numbers]>[data-line]::before]:text-gray-400 [&>code[data-line-numbers]>[data-line]::before]:[counter-increment:line] [&>code[data-line-numbers]>[data-line]::before]:content-[counter(line)]",
  "dark:[&>code[data-line-numbers]>[data-line]::before]:text-gray-500",
  "[&>code[data-line-numbers-max-digits='2']>[data-line]::before]:w-8",
  "[&>code[data-line-numbers-max-digits='3']>[data-line]::before]:w-10",
  "[&>code[data-line-numbers-max-digits='4']>[data-line]::before]:w-12",
].join(" ");

export function MacCodeBlock({
  language,
  className,
  ...props
}: MacCodeBlockProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.35)] dark:border-gray-700 dark:bg-slate-900 dark:shadow-[0_10px_24px_-16px_rgba(2,6,23,0.95)]">
      <div className="grid grid-cols-[4.25rem_1fr_4.25rem] items-center border-b border-gray-200 bg-gray-100 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="justify-self-center text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
          {language.toLowerCase()}
        </span>
        <span aria-hidden className="h-3 w-17" />
      </div>
      <div className="overflow-x-auto">
        <pre
          className={`${PRE_BASE_CLASSES} ${className ?? ""}`.trim()}
          data-language={language}
          {...props}
        />
      </div>
    </div>
  );
}
