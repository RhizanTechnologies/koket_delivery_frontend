import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PerformanceComparisonCardProps {
  comparison: {
    revenue_growth: number;
    order_growth: number;
    customer_growth: number;
  };
}

export function PerformanceComparisonCard({
  comparison,
}: PerformanceComparisonCardProps) {
  const metrics = [
    {
      label: "Revenue Growth",
      value: comparison.revenue_growth,
      icon:
        comparison.revenue_growth > 0 ? (
          <TrendingUp className="h-4 w-4" />
        ) : comparison.revenue_growth < 0 ? (
          <TrendingDown className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        ),
    },
    {
      label: "Order Growth",
      value: comparison.order_growth,
      icon:
        comparison.order_growth > 0 ? (
          <TrendingUp className="h-4 w-4" />
        ) : comparison.order_growth < 0 ? (
          <TrendingDown className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        ),
    },
    {
      label: "Customer Growth",
      value: comparison.customer_growth,
      icon:
        comparison.customer_growth > 0 ? (
          <TrendingUp className="h-4 w-4" />
        ) : comparison.customer_growth < 0 ? (
          <TrendingDown className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Performance vs Previous Period
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between"
            >
              <span className="text-sm">{metric.label}</span>
              <div className="flex items-center gap-2">
                {metric.icon}
                <span
                  className={`font-semibold ${
                    metric.value > 0
                      ? "text-green-500"
                      : metric.value < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {metric.value > 0 ? "+" : ""}
                  {metric.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          Comparison between current and previous{" "}
          {comparison.revenue_growth !== undefined ? "period" : "time frame"}
        </div>
      </CardContent>
    </Card>
  );
}
