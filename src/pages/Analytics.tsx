import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  BarChart3,
  Package,
  Gift,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#64748b"];

function fmtNumber(value: number, locale = "ar-TN") {
  return new Intl.NumberFormat(locale).format(value || 0);
}

function fmtPercent(value: number) {
  return `${Math.round(value)}%`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200",
  returned: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200",
  cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200",
};

function StatusBadge({ status }: { status?: string }) {
  const { t } = useLanguage();
  const labels: Record<string, string> = {
    pending: t("orders.pending"),
    delivered: t("orders.delivered"),
    returned: t("orders.returned"),
    cancelled: t("orders.cancelled"),
    confirmed: t("orders.confirmed"),
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        statusColors[status ?? ""] ?? "bg-slate-100 dark:bg-slate-800"
      )}
    >
      {labels[status ?? ""] ?? status ?? "-"}
    </span>
  );
}

export default function Analytics() {
  const { t, dir } = useLanguage();
  const { theme } = useTheme();
  const [location, setLocation] = useLocation();
  const dashboardQuery = trpc.merchants.getDashboard.useQuery();

  const analytics = dashboardQuery.data?.analytics;
  const orders = dashboardQuery.data?.orders ?? [];
  const recentOrdersData = analytics?.recentOrdersData ?? [];

  const tabFromPath =
    location === "/analytics/orders"
      ? "orders"
      : location === "/analytics/points"
        ? "points"
        : location === "/analytics/reports"
          ? "reports"
          : "overview";

  const overviewTrend = useMemo(() => {
    if (recentOrdersData.length > 0) {
      return recentOrdersData.map(
        (d: { date: string; count: number }) => ({
          name: d.date,
          orders: Number(d.count),
          points: Number(d.count) * 10,
        })
      );
    }
    return [
      { name: t("analytics.sat"), orders: 0, points: 0 },
      { name: t("analytics.sun"), orders: 0, points: 0 },
    ];
  }, [recentOrdersData, t]);

  const isDark = theme === "dark";
  const chartGridColor = isDark ? "#1e293b" : "#e2e8f0";
  const chartTickColor = isDark ? "#64748b" : "#94a3b8";
  const chartTooltipStyle = {
    borderRadius: "8px",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    background: isDark ? "#1e293b" : "var(--card)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  };
  const locale = dir === "rtl" ? "ar-TN" : "fr-TN";

  const total = analytics?.totalOrders ?? 0;
  const success = analytics?.successfulOrders ?? 0;
  const failed = total - success;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
  const rtoRate = analytics?.rtoRate ?? 0;
  const growth = analytics?.monthlyGrowth ?? 0;

  const orderStats = { total, success, failed, pending: 0 };
  const pointsStats = {
    earned: analytics?.pointsEarned ?? 0,
    converted: analytics?.pointsSpent ?? 0,
    balance: analytics?.creditsBalance ?? 0,
  };
  const reportsStats = {
    total: analytics?.reportsTotal ?? 0,
  };

  const orderBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of orders) {
      const s = o.status || "unknown";
      counts[s] = (counts[s] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
      color: PIE_COLORS[["delivered", "pending", "returned", "cancelled"].indexOf(status)] ?? "#94a3b8",
    }));
  }, [orders]);

  if (dashboardQuery.isLoading) return <LoadingSkeleton />;

  if (dashboardQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("dashboard.error")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("dashboard.retry")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={dir}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("analytics.title")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t("analytics.subtitle")}</p>
      </div>

      <Tabs
        value={tabFromPath}
        onValueChange={(v) =>
          setLocation(v === "overview" ? "/analytics" : `/analytics/${v}`)
        }
        dir={dir}
      >
        <div className="overflow-x-auto pb-1">
          <TabsList dir={dir}>
            <TabsTrigger value="overview" className="gap-1.5">
              <BarChart3 className="w-4 h-4 hidden sm:inline" />
              {t("analytics.overview")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5">
              <Package className="w-4 h-4 hidden sm:inline" />
              {t("analytics.orders")}
            </TabsTrigger>
            <TabsTrigger value="points" className="gap-1.5">
              <Gift className="w-4 h-4 hidden sm:inline" />
              {t("analytics.points")}
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-1.5">
              <FileText className="w-4 h-4 hidden sm:inline" />
              {t("analytics.reports")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="shadow-sm dark:bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("analytics.totalOrders")}
                  </span>
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{fmtNumber(total, locale)}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm dark:bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("analytics.successRate")}
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-500 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {fmtPercent(successRate)}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm dark:bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("analytics.rto")}
                  </span>
                  <div className="p-2 rounded-lg bg-rose-500 text-white">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {fmtPercent(rtoRate)}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm dark:bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("analytics.growth")}
                  </span>
                  <div className="p-2 rounded-lg bg-violet-500 text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {growth > 0 ? "+" : ""}
                  {fmtPercent(growth)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  {t("analytics.orderTrend")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overviewTrend}>
                      <defs>
                        <linearGradient id="trendG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: chartTickColor }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: chartTickColor }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                          background: "var(--card)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        fill="url(#trendG)"
                        strokeWidth={2}
                        name={t("analytics.orders")}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-violet-500" />
                  {t("analytics.performance")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: t("analytics.successRate"), value: successRate },
                        { name: t("analytics.rto"), value: rtoRate },
                        { name: t("analytics.growth"), value: Math.min(100, Math.max(0, growth)) },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: chartTickColor }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: chartTickColor }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                          background: "var(--card)",
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                        {[successRate, rtoRate, growth].map((_, i) => (
                          <Cell
                            key={i}
                            fill={["#10b981", "#ef4444", "#8b5cf6"][i]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: t("analytics.totalOrders"), value: orderStats.total, color: "text-foreground" },
              { label: t("orders.delivered"), value: orderStats.success, color: "text-emerald-600 dark:text-emerald-400" },
              { label: t("orders.returned"), value: orderStats.failed, color: "text-red-600 dark:text-red-400" },
              { label: t("orders.pending"), value: orderStats.pending, color: "text-amber-600 dark:text-amber-400" },
            ].map((s) => (
              <Card key={s.label} className="shadow-sm dark:bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", s.color)}>
                    {fmtNumber(s.value)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm dark:bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                {t("analytics.orderBreakdown")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderBreakdown.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t("orders.noOrders")}</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="h-[220px] w-[220px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {orderBreakdown.map((entry, i) => (
                            <Cell
                              key={entry.name}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                            background: "var(--card)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 w-full max-w-xs">
                    {orderBreakdown.map((entry, i) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          <StatusBadge status={entry.name} />
                        </div>
                        <span className="font-medium text-foreground">
                          {fmtNumber(entry.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: t("analytics.pointsEarned"), value: pointsStats.earned, color: "text-emerald-600 dark:text-emerald-400" },
              { label: t("analytics.pointsConverted"), value: pointsStats.converted, color: "text-blue-600 dark:text-blue-400" },
              { label: t("analytics.pointsBalance"), value: pointsStats.balance, color: "text-purple-600 dark:text-purple-400" },
            ].map((s) => (
              <Card key={s.label} className="shadow-sm dark:bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", s.color)}>
                    {fmtNumber(s.value)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm dark:bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                        {t("analytics.metric")}
                      </th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                        {t("analytics.value")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-foreground">{t("analytics.totalEarned")}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {fmtNumber(pointsStats.earned)}
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-foreground">{t("analytics.totalSpent")}</td>
                      <td className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">
                        {fmtNumber(pointsStats.converted)}
                      </td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-foreground">{t("analytics.currentBalance")}</td>
                      <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">
                        {fmtNumber(pointsStats.balance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: t("analytics.totalReports"), value: reportsStats.total, color: "text-foreground" },
            ].map((s) => (
              <Card key={s.label} className="shadow-sm dark:bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", s.color)}>
                    {fmtNumber(s.value)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm dark:bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                        {t("analytics.metric")}
                      </th>
                      <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                        {t("analytics.value")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-foreground">{t("analytics.totalReports")}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {fmtNumber(reportsStats.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
