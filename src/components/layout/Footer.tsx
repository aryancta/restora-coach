import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Restora Coach is a supportive coaching aid, not medical advice. Always
          follow guidance from your clinician.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/research" className="hover:text-foreground">
            Research
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
