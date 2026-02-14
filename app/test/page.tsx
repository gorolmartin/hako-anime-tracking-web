import { ThemeToggle } from "../ThemeToggle";
import { Button, Card, Input, Typography } from "@/components/ui";

function ColorSwatch({
  bgClass,
  label,
  textClass,
}: {
  bgClass: string;
  label: string;
  textClass: "text-gray-900" | "text-gray-50";
}) {
  return (
    <div className={`${bgClass} rounded-lg p-2 min-h-[3rem] flex items-end`}>
      <span className={`text-caption leading-caption tracking-caption font-normal ${textClass}`}>
        {label}
      </span>
    </div>
  );
}

const GRAY_SWATCHES: { bg: string; label: string; light: boolean }[] = [
  { bg: "bg-gray-50", label: "gray-50", light: true },
  { bg: "bg-gray-100", label: "gray-100", light: true },
  { bg: "bg-gray-150", label: "gray-150", light: true },
  { bg: "bg-gray-200", label: "gray-200", light: true },
  { bg: "bg-gray-300", label: "gray-300", light: true },
  { bg: "bg-gray-400", label: "gray-400", light: true },
  { bg: "bg-gray-500", label: "gray-500", light: false },
  { bg: "bg-gray-600", label: "gray-600", light: false },
  { bg: "bg-gray-700", label: "gray-700", light: false },
  { bg: "bg-gray-800", label: "gray-800", light: false },
  { bg: "bg-gray-850", label: "gray-850", light: false },
  { bg: "bg-gray-900", label: "gray-900", light: false },
  { bg: "bg-gray-925", label: "gray-925", light: false },
  { bg: "bg-gray-950", label: "gray-950", light: false },
  { bg: "bg-gray-975", label: "gray-975", light: false },
];

const BLUE_SWATCHES = [
  "bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500",
  "bg-blue-600", "bg-blue-700", "bg-blue-800", "bg-blue-900", "bg-blue-950",
].map((bg, i) => ({ bg, label: `blue-${["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"][i]}`, light: i < 5 }));

const CORAL_SWATCHES = [
  "bg-coral-50", "bg-coral-100", "bg-coral-200", "bg-coral-300", "bg-coral-400", "bg-coral-500",
  "bg-coral-600", "bg-coral-700", "bg-coral-800", "bg-coral-900", "bg-coral-950",
].map((bg, i) => ({ bg, label: `coral-${["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"][i]}`, light: i < 5 }));

const GREEN_SWATCHES = [
  "bg-green-50", "bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-500",
  "bg-green-600", "bg-green-700", "bg-green-800", "bg-green-900", "bg-green-950",
].map((bg, i) => ({ bg, label: `green-${["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"][i]}`, light: i < 5 }));

const RED_SWATCHES = [
  "bg-red-50", "bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500",
  "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900", "bg-red-950",
].map((bg, i) => ({ bg, label: `red-${["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"][i]}`, light: i < 5 }));

function PaletteSection({
  title,
  swatches,
}: {
  title: string;
  swatches: { bg: string; label: string; light: boolean }[];
}) {
  return (
    <section>
      <h2 className="text-h3 leading-h3 tracking-h3 font-medium text-text-primary mb-4">{title}</h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {swatches.map(({ bg, label, light }) => (
          <ColorSwatch
            key={label}
            bgClass={bg}
            label={label}
            textClass={light ? "text-gray-900" : "text-gray-50"}
          />
        ))}
      </div>
    </section>
  );
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-bg-app text-text-primary font-sans">
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border-default pb-6">
          <h1 className="text-display leading-display tracking-display font-medium text-text-primary">
            Design system test
          </h1>
          <ThemeToggle />
        </header>

        <section>
          <Typography variant="h2" className="mb-6">Base UI components</Typography>

          <div className="space-y-8">
            <div>
              <Typography variant="h3" className="mb-4">Button</Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" size="md">Primary</Button>
                <Button variant="primary" size="sm">Primary sm</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="secondary" size="sm">Secondary sm</Button>
                <Button variant="ghost" size="md">Ghost</Button>
                <Button variant="ghost" size="sm">Ghost sm</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <Typography variant="h3" className="mb-4">Card</Typography>
              <Card className="max-w-md">
                <Typography variant="h4" className="mb-2">Card title</Typography>
                <Typography variant="body" className="text-text-secondary">
                  Surface background, hover effect, and rounded corners. Use className to customize.
                </Typography>
              </Card>
            </div>

            <div>
              <Typography variant="h3" className="mb-4">Input</Typography>
              <div className="max-w-md space-y-3">
                <Input placeholder="Placeholder text" />
                <Input placeholder="Disabled input" disabled />
              </div>
            </div>

            <div>
              <Typography variant="h3" className="mb-4">Typography</Typography>
              <div className="space-y-3">
                <Typography variant="display">Display — 56px</Typography>
                <Typography variant="h1">Heading 1 — 40px</Typography>
                <Typography variant="h2">Heading 2 — 32px</Typography>
                <Typography variant="h3">Heading 3 — 24px</Typography>
                <Typography variant="h4">Heading 4 — 20px</Typography>
                <Typography variant="body">Body — 16px default text</Typography>
                <Typography variant="body-sm">Body small — 14px</Typography>
                <Typography variant="caption">Caption — 13px metadata</Typography>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-h2 leading-h2 tracking-h2 font-medium text-text-primary mb-6">Semantic colors</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-bg-app border border-border-default rounded-lg p-4">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-2">bg-bg-app</p>
              <p className="text-body leading-body tracking-body font-normal text-text-primary">App background</p>
            </div>
            <div className="bg-bg-surface border border-border-default rounded-lg p-4">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-2">bg-bg-surface</p>
              <p className="text-body leading-body tracking-body font-normal text-text-primary">Surface</p>
            </div>
            <div className="bg-bg-surface-raised border border-border-default rounded-lg p-4">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-2">bg-bg-surface-raised</p>
              <p className="text-body leading-body tracking-body font-normal text-text-primary">Raised surface</p>
            </div>
            <div className="bg-bg-interactive border border-border-strong rounded-lg p-4">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-2">bg-bg-interactive</p>
              <p className="text-body leading-body tracking-body font-normal text-text-primary">Interactive</p>
            </div>
            <div className="bg-accent-blue text-text-on-fill rounded-lg p-4">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-gray-200 mb-2">bg-accent-blue</p>
              <p className="text-body leading-body tracking-body font-normal">Blue accent</p>
            </div>
            <div className="bg-accent-coral text-text-on-fill rounded-lg p-4">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-gray-200 mb-2">bg-accent-coral</p>
              <p className="text-body leading-body tracking-body font-normal">Coral accent</p>
            </div>
            <div className="bg-success-muted text-success-text rounded-lg p-4 border border-border-default">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase mb-2">bg-success-muted</p>
              <p className="text-body leading-body tracking-body font-normal">Success muted</p>
            </div>
            <div className="bg-error-muted text-error-text rounded-lg p-4 border border-border-default">
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase mb-2">bg-error-muted</p>
              <p className="text-body leading-body tracking-body font-normal">Error muted</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-body leading-body tracking-body font-normal text-text-primary">text-text-primary</p>
            <p className="text-body leading-body tracking-body font-normal text-text-secondary">text-text-secondary</p>
            <p className="text-body leading-body tracking-body font-normal text-text-tertiary">text-text-tertiary</p>
            <p className="text-body leading-body tracking-body font-normal text-accent-blue-text">text-accent-blue-text</p>
            <p className="text-body leading-body tracking-body font-normal text-accent-coral-text">text-accent-coral-text</p>
          </div>
        </section>

        <section>
          <h2 className="text-h2 leading-h2 tracking-h2 font-medium text-text-primary mb-6">Color palettes</h2>
          <div className="space-y-8">
            <PaletteSection title="Gray" swatches={GRAY_SWATCHES} />
            <PaletteSection title="Blue" swatches={BLUE_SWATCHES} />
            <PaletteSection title="Coral" swatches={CORAL_SWATCHES} />
            <PaletteSection title="Green" swatches={GREEN_SWATCHES} />
            <PaletteSection title="Red" swatches={RED_SWATCHES} />
          </div>
        </section>

        <section>
          <h2 className="text-h2 leading-h2 tracking-h2 font-medium text-text-primary mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-display</p>
              <p className="text-display leading-display tracking-display font-medium text-text-primary">Display 56px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-h1</p>
              <p className="text-h1 leading-h1 tracking-h1 font-medium text-text-primary">Heading 1 — 40px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-h2</p>
              <p className="text-h2 leading-h2 tracking-h2 font-medium text-text-primary">Heading 2 — 32px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-h3</p>
              <p className="text-h3 leading-h3 tracking-h3 font-medium text-text-primary">Heading 3 — 24px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-h4</p>
              <p className="text-h4 leading-h4 tracking-h4 font-medium text-text-primary">Heading 4 — 20px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-h5</p>
              <p className="text-h5 leading-h5 tracking-h5 font-medium text-text-primary">Heading 5 — 17px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-body-lg</p>
              <p className="text-body-lg leading-body-lg tracking-body-lg font-normal text-text-primary">Body large — 18px lead paragraph</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-body</p>
              <p className="text-body leading-body tracking-body font-normal text-text-primary">Body — 16px default</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-body-sm</p>
              <p className="text-body-sm leading-body-sm tracking-body-sm font-normal text-text-primary">Body small — 14px</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-caption</p>
              <p className="text-caption leading-caption tracking-caption font-normal text-text-primary">Caption — 13px metadata</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-overline</p>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-primary">Overline — 11px label</p>
            </div>
            <div>
              <p className="text-overline leading-overline tracking-overline font-semibold uppercase text-text-tertiary mb-1">text-micro</p>
              <p className="text-micro leading-micro tracking-micro font-medium text-text-primary">Micro — 10px</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-h2 leading-h2 tracking-h2 font-medium text-text-primary mb-6">Font weights</h2>
          <div className="space-y-4">
            <p className="text-body leading-body tracking-body font-normal text-text-primary">
              font-normal (400) — Body, descriptions, captions
            </p>
            <p className="text-body leading-body tracking-body font-medium text-text-primary">
              font-medium (500) — Headings, titles, buttons
            </p>
            <p className="text-body leading-body tracking-body font-semibold text-text-primary">
              font-semibold (600) — Overlines only
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
