"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-h2 leading-h2 tracking-h2 font-medium text-text-primary mb-2">
        Something went wrong
      </h1>
      <p className="text-body leading-body tracking-body text-text-secondary mb-6 max-w-md">
        We couldn’t load this page. Try again or head back to the home page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="font-medium rounded-lg transition-colors btn-primary-gradient text-text-on-fill text-body leading-body tracking-body px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
      >
        Try again
      </button>
    </div>
  );
}
