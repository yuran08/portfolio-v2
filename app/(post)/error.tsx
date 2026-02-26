"use client";

import { useEffect } from "react";

type PostSegmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PostSegmentError({
  error,
  reset,
}: PostSegmentErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-4 rounded-xl border border-gray-200/80 bg-white p-6 text-gray-900 shadow-sm dark:border-gray-700/80 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-lg font-semibold">Post section failed to render</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          An unexpected error occurred while rendering this route segment.
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
      </div>
    </div>
  );
}
