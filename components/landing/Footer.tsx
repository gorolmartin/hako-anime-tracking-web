import { Typography } from "@/components/ui";

export function Footer() {
  return (
    <footer className="py-8">
      <div className="max-w-5xl mx-auto px-6 flex justify-center text-center">
        <Typography variant="caption" className="text-text-tertiary">
          © 2026 Hako - Anime Tracking Reimagined. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}
