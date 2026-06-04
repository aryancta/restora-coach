import Link from "next/link";

const sources = [
  {
    title: "Home exercise adherence in physical therapy",
    href: "https://www.exer.ai/posts/improve-home-exercise-adherence-in-physical-therapy",
    note: "Up to 70% nonadherence; keep programs to about three exercises.",
  },
  {
    title: "Barriers to adherence in physiotherapy (PMC)",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2923776/",
    note: "Positive feedback and supportive relationships improve adherence.",
  },
  {
    title: "Video home exercise and fall risk (PMC)",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8681786/",
    note: "Remote guided exercise reduced fall risk in older adults.",
  },
  {
    title: "Browser pose estimation for form correction",
    href: "https://ijircst.org/abstract.php?article_id=1420",
    note: "MediaPipe joint angles are feasible for real-time coaching in-browser.",
  },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Research backing</h1>
      <p className="mt-3 text-muted-foreground">
        Design choices in Restora Coach map to published findings on adherence,
        fall prevention, and browser-based pose estimation.
      </p>
      <ul className="mt-8 space-y-6">
        {sources.map((s) => (
          <li key={s.href} className="border-b border-border pb-6">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              {s.title}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Back home
        </Link>
      </p>
    </div>
  );
}
