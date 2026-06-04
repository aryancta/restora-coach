import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1 className="text-3xl font-bold text-foreground">About Restora Coach</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        We built Restora Coach for people doing home physiotherapy after injury or
        surgery, and for older adults working on balance to prevent falls. Most
        pose apps count gym reps. We focus on short rehab routines, safety
        guardrails, and the motivation loop that keeps patients from quitting.
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Built by Aryan Choudhary for the Health and Fitness Technology track.
        Everything runs in the browser: your video never leaves your device for
        pose analysis.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/goals">Try a session</Link>
      </Button>
    </div>
  );
}
