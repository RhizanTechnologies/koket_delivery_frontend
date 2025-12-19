"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useMemo, useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import StatCard from "./components/DashboardCard";
import OrderDistributionCard from "./components/DistributionCard";
import TopSellingProductsCard from "./components/TopSellingProductsCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getDashboardOverview } from "@/app/services/admin/analyticsService";
import { DashboardOverviewDTO } from "@/app/types/analytics";
import { RevenueTrendCard } from "./components/RevenueTrendCard";
import { CustomerMetricsCard } from "./components/CustomerMetricsCard";
import { TopCategoriesCard } from "./components/TopCategoriesCard";
import { PerformanceComparisonCard } from "./components/PerformanceComparisonCard";
import LoadingState from "@/components/LoadingState";

function AdminPage() {
  const [reportRange, setReportRange] = useState("Daily Report");
  const [overview, setOverview] = useState<DashboardOverviewDTO | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoadingOverview(true);
        const data = await getDashboardOverview();
        setOverview(data);
      } catch (err) {
        console.error("Failed to load dashboard overview:", err);
      } finally {
        setLoadingOverview(false);
      }
    };
    loadOverview();
  }, []);

  const periodData = (() => {
    if (!overview) return null;
    switch (reportRange) {
      case "Weekly Report":
        return overview.weekly;
      case "Annual Report":
        return overview.monthly;
      case "Daily Report":
      default:
        return overview.today;
    }
  })();

  const stats = periodData
    ? {
        totalRevenue: `ETB ${Number(
          periodData.total_revenue || 0
        ).toLocaleString()}`,
        totalOrders: String(periodData.total_orders || 0),
        upfrontCollected: `ETB ${Number(
          periodData.total_upfront_collected || 0
        ).toLocaleString()}`,
        upcomingDeliveries: String(periodData.upcoming_deliveries || 0),
        averageRating: periodData.average_rating?.toFixed(1) || "0.0",
        subtextRevenue: `${periodData.revenue_trend?.length || 0} data points`,
      }
    : {
        totalRevenue: "ETB 0",
        totalOrders: "0",
        upfrontCollected: "ETB 0",
        upcomingDeliveries: "0",
        averageRating: "0.0",
        subtextRevenue: "",
      };

  const orderStatuses = periodData
    ? [
        {
          label: "Pending",
          count: periodData.orders_by_status?.pending || 0,
          color: "#FACC15",
        },
        {
          label: "Accepted",
          count: periodData.orders_by_status?.accepted || 0,
          color: "#3B82F6",
        },
        {
          label: "Completed",
          count: periodData.orders_by_status?.completed || 0,
          color: "#22C55E",
        },
        {
          label: "Rejected",
          count: periodData.orders_by_status?.rejected || 0,
          color: "#EF4444",
        },
      ]
    : [];

  const topProducts = periodData
    ? periodData.top_products?.map((p: any) => ({
        name: p.product_name,
        revenue: p.revenue,
        orderCount: p.order_count,
      })) || []
    : [];

  const period =
    reportRange === "Daily Report"
      ? "daily"
      : reportRange === "Weekly Report"
      ? "weekly"
      : "monthly";

  if (loadingOverview) {
    return (
      <ProtectedRoute requireAdmin>
        <LoadingState message="Loading dashboard..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background-2">
        {/* Header */}
        <div className="bg-background section-spacing text-center">
          <h1 className="text-4xl md:text-5xl font-kaushan italic mb-3 text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Manage your cake shop and track performance metrics
          </p>
        </div>

        {/* Report Range Selector */}
        <div className="overview flex flex-row items-center justify-between px-4 sm:px-6 lg:px-16 py-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Performance Overview
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {reportRange} • Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              id="report-range"
              value={reportRange}
              onChange={(e) => setReportRange(e.target.value)}
              className="hidden sm:inline-block px-4 py-2 bg-background border border-border rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option>Daily Report</option>
              <option>Weekly Report</option>
              <option>Annual Report</option>
            </select>

            {/* Mobile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open report menu"
                  className="inline-flex items-center gap-2 sm:hidden px-4 py-2 bg-background border border-border rounded-lg shadow-sm text-sm"
                >
                  <FaBars />
                  <span className="truncate max-w-[8rem]">{reportRange}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 bg-card rounded-lg shadow-lg p-1 border border-border"
              >
                {["Daily Report", "Weekly Report", "Annual Report"].map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setReportRange(r)}
                    className={`cursor-pointer px-4 py-2 text-sm rounded-md ${
                      reportRange === r
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-accent"
                    }`}
                  >
                    {r}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-16 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            subtext={stats.subtextRevenue}
            iconType="revenue"
            trend={overview?.comparison?.revenue_growth}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            subtext="Completed orders"
            iconType="orders"
            trend={overview?.comparison?.order_growth}
          />
          <StatCard
            title="Upfront Collected"
            value={stats.upfrontCollected}
            subtext="Advance payments"
            iconType="revenue"
          />
          <StatCard
            title="Upcoming Deliveries"
            value={stats.upcomingDeliveries}
            subtext="Scheduled deliveries"
            iconType="orders"
          />
        </div>

        {/* Charts and Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-16 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Trend */}
            {periodData?.revenue_trend && (
              <RevenueTrendCard
                revenueTrend={periodData.revenue_trend}
                period={period}
              />
            )}

            {/* Order Distribution and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OrderDistributionCard statuses={orderStatuses} />
              <TopSellingProductsCard
                products={topProducts}
                // title="Top Selling Products"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Metrics */}
            {periodData?.customer_metrics && (
              <CustomerMetricsCard
                customerMetrics={periodData.customer_metrics}
                growth={overview?.comparison?.customer_growth}
              />
            )}

            {/* Top Categories */}
            {periodData?.top_categories &&
              periodData.top_categories.length > 0 && (
                <TopCategoriesCard topCategories={periodData.top_categories} />
              )}

            {/* Performance Comparison */}
            {overview?.comparison && (
              <PerformanceComparisonCard comparison={overview.comparison} />
            )}

            {/* Additional Metrics Card */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Additional Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Average Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{stats.averageRating}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Order Value Avg
                  </span>
                  <span className="font-bold">
                    ETB{" "}
                    {periodData && periodData.total_orders > 0
                      ? Math.round(
                          periodData.total_revenue / periodData.total_orders
                        ).toLocaleString()
                      : "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Conversion Rate
                  </span>
                  <span className="font-bold">
                    {periodData &&
                    periodData.customer_metrics?.total_customers > 0
                      ? (
                          (periodData.total_orders /
                            periodData.customer_metrics.total_customers) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="px-4 sm:px-6 lg:px-16 mb-12">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-medium text-sm mb-2">
                  📈 Revenue Insights
                </h4>
                <p className="text-sm text-muted-foreground">
                  {periodData?.total_revenue
                    ? `Total revenue of ETB ${periodData.total_revenue.toLocaleString()} from ${
                        periodData.total_orders
                      } orders`
                    : "No revenue data available for this period"}
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-medium text-sm mb-2">
                  👥 Customer Insights
                </h4>
                <p className="text-sm text-muted-foreground">
                  {periodData?.customer_metrics
                    ? `${periodData.customer_metrics.new_customers} new customers and ${periodData.customer_metrics.returning_customers} returning customers`
                    : "No customer data available"}
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-medium text-sm mb-2">📊 Performance</h4>
                <p className="text-sm text-muted-foreground">
                  {overview?.comparison
                    ? `Revenue ${
                        overview.comparison.revenue_growth > 0
                          ? "increased"
                          : "decreased"
                      } by ${Math.abs(
                        overview.comparison.revenue_growth
                      )}% from previous period`
                    : "No comparison data available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminPage;
