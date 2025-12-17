import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  iconType: "revenue" | "orders" | "products" | "customers" | "requests";
  trend?: number;
}

export default function StatCard({
  title,
  value,
  subtext,
  iconType,
  trend,
}: StatCardProps) {
  const icons = {
    revenue: <DollarSign className="h-5 w-5 text-green-500" />,
    orders: <ShoppingCart className="h-5 w-5 text-blue-500" />,
    products: <Package className="h-5 w-5 text-purple-500" />,
    customers: <Users className="h-5 w-5 text-orange-500" />,
    requests: <Package className="h-5 w-5 text-yellow-500" />,
  };

  const trendColor = trend
    ? trend > 0
      ? "text-green-500"
      : trend < 0
      ? "text-red-500"
      : "text-gray-500"
    : "";

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icons[iconType]}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{subtext}</p>
          {trend !== undefined && (
            <div className={`flex items-center text-xs ${trendColor}`}>
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : trend < 0 ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : null}
              {trend > 0 ? "+" : ""}
              {trend}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
