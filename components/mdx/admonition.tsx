import type { ComponentPropsWithoutRef } from "react";

type AdmonitionProps = ComponentPropsWithoutRef<"aside"> & {
  title?: string;
};

function Admonition({
  title,
  children,
  className,
  ...props
}: AdmonitionProps) {
  return (
    <aside
      className={`mt-8 rounded-xl border px-4 py-3 ${className ?? ""}`.trim()}
      {...props}
    >
      {title ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{title}</p>
      ) : null}
      <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_ol]:max-w-none [&_ol]:text-inherit [&_p]:max-w-none [&_p]:text-inherit [&_ul]:max-w-none [&_ul]:text-inherit">
        {children}
      </div>
    </aside>
  );
}

export function Note({ title = "提示", ...props }: AdmonitionProps) {
  return (
    <Admonition
      title={title}
      className="border-sky-200/90 bg-sky-50/80 text-sky-900 dark:border-sky-400/40 dark:bg-sky-500/10 dark:text-sky-100"
      {...props}
    />
  );
}

export function Warning({ title = "注意", ...props }: AdmonitionProps) {
  return (
    <Admonition
      title={title}
      className="border-amber-200/90 bg-amber-50/85 text-amber-900 dark:border-amber-400/45 dark:bg-amber-500/10 dark:text-amber-100"
      {...props}
    />
  );
}
