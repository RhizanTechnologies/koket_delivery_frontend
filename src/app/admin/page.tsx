"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import StatCard from "./components/DashboardCard";
import OrderDistributionCard from "./components/DistributionCard";
import TopSellingProductsCard from "./components/TopSellingProductsCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getDashboardOverview } from "@/app/services/admin/analyticsService";
import { DashboardOverviewDTO } from "@/app/types/analytics";

function AdminPage() {
  const categories = [
    "All Products",
    "Cake",
    "Quick Bread",
    "Cookies",
    "Fondant Cake",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [reportRange, setReportRange] = useState("Daily Report");

  const items = categories.map((label) => ({
    id: label.replace(/\s+/g, "-").toLowerCase(),
    label,
  }));
  const activeTabItem =
    items.find((it) => it.label === selectedCategory) ?? items[0];

  function handleTabClick(label: string) {
    setSelectedCategory(label);
  }

  // derive the data shown on the page based on the selected report range
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
        activeOrders: String(periodData.orders_by_status?.pending || 0),
        customRequests: String(periodData.orders_by_status?.pending || 0),
        totalProducts: String(periodData.top_products?.length || 0),
        subtextRevenue: `From ${periodData.revenue_trend?.length || 0} points`,
      }
    : {
        totalRevenue: "$0.00",
        activeOrders: "0",
        customRequests: "0",
        totalProducts: "0",
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
      })) || []
    : [];

  return (
    <ProtectedRoute requireAdmin>
      <div>
        <div className="bg-background-2 section-spacing text-center">
          <h1 className="text-4xl md:text-5xl font-kaushan italic mb-3 text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Manage your cake shop and track performance
          </p>
        </div>

        <div className="overview flex flex-row items-center justify-between px-4 sm:px-6 lg:px-16 py-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Overview
          </h1>
          <div className="flex items-center gap-4">
            <label htmlFor="report-range" className="sr-only">
              Report range
            </label>
            {/* Desktop: regular select (shown on sm and up) */}
            <label htmlFor="report-range" className="sr-only">
              Report range
            </label>

            <select
              id="report-range"
              value={reportRange}
              onChange={(e) => setReportRange(e.target.value)}
              className="hidden sm:inline-block px-3 py-2 bg-background border border-border rounded-md shadow-sm text-sm"
            >
              <option>Daily Report</option>
              <option>Weekly Report</option>
              <option>Annual Report</option>
            </select>

            {/* Mobile: hamburger dropdown (shown below sm) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open report menu"
                  className="inline-flex items-center gap-2 sm:hidden px-3 py-2 bg-background border border-border rounded-md shadow-sm text-sm"
                >
                  <FaBars />
                  <span className="truncate max-w-[8rem]">{reportRange}</span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-44 bg-card rounded-md shadow-md p-1"
              >
                {["Daily Report", "Weekly Report", "Annual Report"].map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setReportRange(r)}
                    className={`cursor-pointer px-3 py-2 text-sm ${
                      reportRange === r ? "bg-background-2 font-medium" : ""
                    }`}
                  >
                    {r}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 gap-4 px-4 sm:px-6 lg:px-16 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            subtext={stats.subtextRevenue}
            iconType="revenue"
          />
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            subtext="Needs attention"
            iconType="orders"
          />
          {/* <StatCard
            title="Custom Requests"
            value={stats.customRequests}
            subtext="Pending Requests"
            iconType="requests"
          /> */}
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            subtext={`${stats.totalProducts} in stock`}
            iconType="products"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 sm:px-6 lg:px-16 mb-8">
          <OrderDistributionCard statuses={orderStatuses} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminPage;
