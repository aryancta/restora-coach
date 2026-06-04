"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SessionRecord } from "@/types";

export function ProgressChart({ sessions }: { sessions: SessionRecord[] }) {
  const data = sessions
    .slice(-14)
    .map((s) => ({
      date: s.date.slice(5),
      score: s.overallFormScore,
      label: s.goalTitle,
    }));

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Complete a session to see your form score trend.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value ?? 0}%`, "Form score"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(168 55% 38%)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
