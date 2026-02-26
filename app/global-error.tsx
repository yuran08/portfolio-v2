"use client";

import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <main className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest ? (
            <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
              Error ID: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  );
}
