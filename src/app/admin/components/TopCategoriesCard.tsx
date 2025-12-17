import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface TopCategoriesCardProps {
  topCategories: Array<{
    category_name: string;
    order_count: number;
    revenue: number;
  }>;
}

export function TopCategoriesCard({ topCategories }: TopCategoriesCardProps) {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  const chartData = topCategories.map((cat) => ({
    name: cat.category_name,
    value: cat.order_count,
    revenue: cat.revenue,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {topCategories.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No category data
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} orders (ETB ${
                      props.payload.revenue?.toLocaleString() || 0
                    })`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {topCategories.map((category, index) => (
            <div
              key={category.category_name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{category.category_name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{category.order_count} orders</div>
                <div className="text-xs text-muted-foreground">
                  ETB {category.revenue?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
