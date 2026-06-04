import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Camera,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <HeartHandshake className="h-4 w-4" />
              Health and Fitness Technology
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
              Your paper exercise sheet, now with a patient AI physio
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-balance">
              Restora Coach watches home rehab and balance routines through your
              webcam, scores form against safe clinical targets, and keeps you
              motivated with streaks and warm coaching summaries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/goals">Get started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View progress</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground max-w-md">
              Supportive coaching aid only. Not a diagnosis or replacement for
              your clinician. Camera runs locally in your browser.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/hero-diagram.svg"
              alt="Diagram showing webcam pose tracking and safe form feedback loop"
              width={480}
              height={360}
              className="w-full max-w-md drop-shadow-lg h-auto"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold">Why we built this</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Up to 70% of patients skip home physio. They get a sheet of exercises,
          then practice alone with no feedback. We target rehab and fall
          prevention, not gym rep counting, with safety-first corrections and
          short 2 to 3 exercise routines research shows people actually finish.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Camera,
              title: "Live form scoring",
              text: "33-point pose tracking with joint angles, safe-zone indicators, and real-time fixes like keeping your knee behind your toes.",
            },
            {
              icon: ShieldCheck,
              title: "Clinical safety framing",
              text: "Prescribed mini-routines for knee rehab, shoulder mobility, and senior balance with range-of-motion targets and risk warnings.",
            },
            {
              icon: Sparkles,
              title: "Motivation loop",
              text: "Gemini-powered session summaries, adherence streaks, and progress charts so you feel accompanied, not alone.",
            },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{f.text}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Activity className="h-10 w-10 text-primary" />
            <div>
              <p className="font-semibold">60-second judge demo</p>
              <p className="text-sm text-muted-foreground">
                Pick Senior balance or Knee rehab, start webcam, do 2 reps, finish
                for AI coach + streak.
              </p>
            </div>
          </div>
          <Button size="lg" asChild>
            <Link href="/goals">Start a session</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
