"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-bg-app text-text-primary font-sans">
        <h1 className="text-h2 leading-h2 tracking-h2 font-medium mb-2">
          Something went wrong
        </h1>
        <p className="text-body leading-body tracking-body text-text-secondary mb-6 max-w-md">
          A critical error occurred. Try again or refresh the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-medium rounded-lg transition-colors bg-bg-interactive hover:bg-bg-interactive-hover text-text-primary border border-border-default px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
