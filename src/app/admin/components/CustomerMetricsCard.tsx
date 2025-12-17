import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCheck } from "lucide-react";

interface CustomerMetricsCardProps {
  customerMetrics: {
    new_customers: number;
    returning_customers: number;
    total_customers: number;
  };
  growth?: number;
}

export function CustomerMetricsCard({
  customerMetrics,
  growth,
}: CustomerMetricsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Customer Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-blue-500" />
              <span className="text-sm">New Customers</span>
            </div>
            <span className="font-semibold">
              {customerMetrics.new_customers}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="text-sm">Returning Customers</span>
            </div>
            <span className="font-semibold">
              {customerMetrics.returning_customers}
            </span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Customers</span>
              <span className="text-lg font-bold">
                {customerMetrics.total_customers}
              </span>
            </div>
            {growth !== undefined && (
              <div
                className={`text-xs mt-1 ${
                  growth > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {growth > 0 ? "↗" : "↘"} {Math.abs(growth)}% from previous
                period
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
