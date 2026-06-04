import Link from "next/link";
import { notFound } from "next/navigation";
import { getGoal } from "@/lib/exercises";
import { WorkoutSession } from "@/components/workout/WorkoutSession";
import { Button } from "@/components/ui/button";

export default function WorkoutPage({
  params,
}: {
  params: { goalId: string };
}) {
  const goal = getGoal(params.goalId);
  if (!goal) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Live session</p>
          <h1 className="text-2xl font-bold">{goal.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/goals">Change goal</Link>
        </Button>
      </div>
      <WorkoutSession goal={goal} />
    </div>
  );
}
