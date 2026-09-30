import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_OCCUPANCY_WEEK } from "@/lib/mock-dashboard";

/**
 * Lightweight CSS bar chart (no chart dependency) for weekly occupancy.
 * Real charts arrive with the Reports module.
 */
export function OccupancyChart() {
  const max = Math.max(...MOCK_OCCUPANCY_WEEK.map((point) => point.value));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold">Occupancy · last 7 days</CardTitle>
        <span className="text-xs text-muted-foreground">Avg 82%</span>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div
          role="img"
          aria-label="Bar chart of occupancy for the last seven days: Monday 71 percent, Tuesday 74 percent, Wednesday 78 percent, Thursday 82 percent, Friday 91 percent, Saturday 96 percent, Sunday 86 percent"
          className="flex h-36 items-end gap-2"
        >
          {MOCK_OCCUPANCY_WEEK.map((point) => (
            <div key={point.label} className="flex h-full flex-1 flex-col items-center gap-1.5">
              <span className="text-[0.625rem] font-medium text-muted-foreground tabular-nums">
                {point.value}%
              </span>
              <div
                className={
                  "w-full rounded-md bg-primary/75 transition-[height]" +
                  (point.value >= 90 ? " bg-primary" : "")
                }
                style={{ height: `${Math.round((point.value / max) * 100)}%` }}
              />
              <span className="text-[0.625rem] text-muted-foreground">{point.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
