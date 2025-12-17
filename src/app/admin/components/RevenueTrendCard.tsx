import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RevenueTrendCardProps {
  revenueTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  period: "daily" | "weekly" | "monthly";
}

export function RevenueTrendCard({
  revenueTrend,
  period,
}: RevenueTrendCardProps) {
  const calculateTrend = () => {
    if (revenueTrend.length < 2)
      return { trend: 0, icon: <Minus className="h-4 w-4" /> };

    const recent = revenueTrend[revenueTrend.length - 1].revenue;
    const previous = revenueTrend[revenueTrend.length - 2].revenue;
    const change = ((recent - previous) / previous) * 100;

    return {
      trend: change,
      icon:
        change > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        ),
    };
  };

  const { trend, icon } = calculateTrend();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
        <div className="flex items-center gap-1">
          {icon}
          <span
            className={`text-sm font-medium ${
              trend > 0
                ? "text-green-500"
                : trend < 0
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          {revenueTrend.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No data available</p>
              <p className="text-xs mt-1">Select a different period</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-7 gap-2">
                {revenueTrend.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="mt-2 h-32 w-full flex flex-col justify-end">
                      <div
                        className="bg-primary rounded-t-sm transition-all duration-300 hover:opacity-80"
                        style={{
                          height: `${Math.min(
                            (day.revenue / 10000) * 100,
                            100
                          )}%`,
                        }}
                        title={`ETB ${day.revenue.toLocaleString()}`}
                      />
                    </div>
                    <div className="text-xs mt-1">
                      ETB {(day.revenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground text-center">
                {period === "daily"
                  ? "Today's trend"
                  : period === "weekly"
                  ? "Last 7 days"
                  : "Monthly trend"}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
