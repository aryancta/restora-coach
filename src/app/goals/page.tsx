import Link from "next/link";
import { ArrowRight, Bone, PersonStanding, StretchHorizontal } from "lucide-react";
import { GOALS } from "@/lib/exercises";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const icons = {
  knee: Bone,
  shoulder: StretchHorizontal,
  balance: PersonStanding,
};

export default function GoalsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Choose your recovery goal</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Each plan includes 2 to 3 movements, sized for what patients actually
        finish at home. Stand where your full body is visible.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {GOALS.map((goal) => {
          const Icon = icons[goal.icon as keyof typeof icons] ?? Bone;
          return (
            <Card key={goal.id} className="flex flex-col">
              <CardHeader>
                <Icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>{goal.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="text-sm text-muted-foreground flex-1">
                  {goal.clinicalFocus}
                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {goal.exercises.map((e) => (
                    <Badge key={e.id} variant="outline">
                      {e.name}
                    </Badge>
                  ))}
                </div>
                <Button className="mt-6 w-full" asChild>
                  <Link href={`/workout/${goal.id}`}>
                    Start routine
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
