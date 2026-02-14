import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-display leading-display tracking-display font-medium text-text-primary mb-2">
        Not found
      </h1>
      <p className="text-body leading-body tracking-body text-text-secondary mb-6 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="font-medium rounded-lg transition-colors btn-primary-gradient text-text-on-fill text-body leading-body tracking-body px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
      >
        Back to home
      </Link>
    </div>
  );
}
