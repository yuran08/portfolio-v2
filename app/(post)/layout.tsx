import Link from "next/link";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-8 text-sm">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <span aria-hidden="true">←</span>
          Back to blog
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
