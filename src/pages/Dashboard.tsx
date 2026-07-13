import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
  ResponsiveContainer, AreaChart, Area, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Package, Phone, FileText, Plug, TrendingUp, AlertTriangle,
  CheckCircle2, Shield, ChevronLeft, ChevronRight, ShoppingCart,
  BarChart3, Target, Coins, DollarSign, Flame, CircleAlert,
  ArrowRight, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

function fmtCurrency(value: number, locale = "ar-TN") {
  return new Intl.NumberFormat(locale, {
    style: "currency", currency: "TND", maximumFractionDigits: 0,
  }).format(value || 0);
}

function fmtNumber(value: number, locale = "ar-TN") {
  return new Intl.NumberFormat(locale).format(value || 0);
}

type OrderRow = { id: string; customerName?: string; phoneNumber?: string; orderAmount?: number; status?: string };

function StatusBadge({ status }: { status?: string }) {
  const { t } = useLanguage();
  const cfg: Record<string, { label: string; class: string }> = {
    pending: { label: t("orders.pending"), class: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200" },
    delivered: { label: t("orders.delivered"), class: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200" },
    returned: { label: t("orders.returned"), class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200" },
    cancelled: { label: t("orders.cancelled"), class: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200" },
    confirmed: { label: t("orders.confirmed"), class: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200" },
  };
  const c = cfg[status ?? ""] ?? { label: status ?? "-", class: "bg-slate-100 dark:bg-slate-800" };
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", c.class)}>{c.label}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Skeleton className="h-80 rounded-xl" /><Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t, dir, lang } = useLanguage();
  const { theme } = useTheme();
  const [, setLocation] = useLocation();
  const dashboardQuery = trpc.merchants.getDashboard.useQuery();
  const merchant = dashboardQuery.data?.merchant ?? null;
  const orders: OrderRow[] = dashboardQuery.data?.orders ?? [];
  const analytics = dashboardQuery.data?.analytics;
  const [orderPage, setOrderPage] = useState(0);
  const [orderSearch, setOrderSearch] = useState("");
  const orderPageSize = 5;

  const locale = lang === "ar" ? "ar-TN" : lang === "fr" ? "fr-TN" : "en-US";
  const total = analytics?.totalOrders ?? 0;
  const success = Math.round(analytics?.successRate ?? 0);
  const rto = Math.round(analytics?.rtoRate ?? 0);
  const revenue = orders.reduce((sum, o) => sum + (o.orderAmount ?? 0), 0);
  const growth = analytics?.monthlyGrowth ?? 0;
  const balance = analytics?.creditsBalance ?? 0;
  const reportCompletionRate = analytics?.reportCompletionRate ?? 0;
  const reportStreak = analytics?.reportStreak ?? 0;
  const missingReportCount = analytics?.missingReportCount ?? 0;

  const stats = useMemo(() => [
    { title: t("dashboard.totalOrders"), value: fmtNumber(total, locale), subtitle: `${t("dashboard.growth")} ${growth > 0 ? "+" : ""}${growth}%`, icon: Package, color: "from-blue-500 to-blue-600" },
    { title: t("dashboard.successRate"), value: `${success}%`, subtitle: `${analytics?.successfulOrders ?? 0} ${t("dashboard.delivered")}`, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { title: t("dashboard.rto"), value: `${rto}%`, subtitle: t("dashboard.rtoRate"), icon: AlertTriangle, color: "from-rose-500 to-rose-600" },
    { title: t("dashboard.revenue"), value: fmtCurrency(revenue, locale), subtitle: `${fmtNumber(total, locale)} ${t("dashboard.orders")}`, icon: DollarSign, color: "from-violet-500 to-violet-600" },
  ], [total, success, rto, revenue, growth, analytics, t, locale]);

  const isDark = theme === "dark";
  const chartGridColor = isDark ? "#1e293b" : "#e2e8f0";
  const chartTickColor = isDark ? "#64748b" : "#94a3b8";
  const chartTooltipStyle = {
    borderRadius: "8px",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    background: isDark ? "#1e293b" : "var(--card)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  };

  const quickActions = [
    { label: t("dashboard.verifyPhone"), path: "/phone-verification", icon: Phone },
    { label: t("dashboard.reports"), path: "/reports", icon: FileText },
    { label: t("dashboard.plugins"), path: "/plugins", icon: Plug },
    { label: t("dashboard.analytics"), path: "/analytics", icon: BarChart3 },
  ];

  if (dashboardQuery.isLoading) return <LoadingSkeleton />;

  if (dashboardQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("dashboard.error")}</p>
            <Button variant="outline" className="mt-4" onClick={() => dashboardQuery.refetch()}>{t("dashboard.retry")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1.5 text-sm gap-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            <Shield className="w-3.5 h-3.5" />{merchant?.businessName || t("dashboard.merchant")}
          </Badge>
          <Badge className="px-3 py-1.5 text-sm gap-2 bg-amber-500 text-white">
            <Coins className="w-3.5 h-3.5" />{fmtNumber(balance)} {t("common.credits")}
          </Badge>
        </div>
      </div>

      {/* Gamification row: streak + completion rate */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-900/20">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-xl" />
          <CardContent className="p-3 flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              reportStreak > 0 ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
            )}>
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("dashboard.reportStreak")}</p>
              <p className="text-lg font-bold">{reportStreak} {t("dashboard.days")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-900/20">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-xl" />
          <CardContent className="p-3 flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              reportCompletionRate >= 80 ? "bg-emerald-500 text-white" : reportCompletionRate >= 50 ? "bg-amber-500 text-white" : "bg-red-500 text-white"
            )}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t("dashboard.reportRate")}</p>
              <p className="text-lg font-bold">{reportCompletionRate}%</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => setLocation("/reports")}>
              {t("dashboard.reportNow")} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Button>
          </CardContent>
        </Card>

        {missingReportCount > 0 && (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-900/20 sm:col-span-2">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500 text-white">
                <CircleAlert className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t("dashboard.missingReports")}</p>
                <p className="text-lg font-bold">{missingReportCount} {t("orders.title")}</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => setLocation("/orders")}>
                {t("dashboard.viewAll")} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-0 overflow-hidden shadow-sm dark:bg-card">
            <div className={cn("h-1 bg-gradient-to-r", s.color)} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{s.title}</span>
                <div className={cn("p-2 rounded-lg text-white bg-gradient-to-br", s.color)}><s.icon className="w-5 h-5" /></div>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5">{s.subtitle}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <Button key={action.path} onClick={() => setLocation(action.path)}
            className={cn(
              "h-auto py-4 px-4 shadow-sm hover:shadow-md transition-all",
              ["bg-emerald-600 hover:bg-emerald-700 text-white", "bg-blue-600 hover:bg-blue-700 text-white", "bg-violet-600 hover:bg-violet-700 text-white", "bg-amber-600 hover:bg-amber-700 text-white"][i]
            )}>
            <div className="flex items-center gap-3"><action.icon className="w-5 h-5" /><span className="font-medium">{action.label}</span></div>
          </Button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border-0 dark:bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-xl" />
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" />{t("dashboard.orderAnalysis")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.recentOrdersData || []}>
                  <defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTickColor }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTickColor }} />
                  <ChartTooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#og)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 dark:bg-card">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-t-xl" />
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Target className="w-4 h-4 text-violet-500" />{t("dashboard.performance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: t("dashboard.successRate"), value: success }, { name: t("dashboard.rto"), value: rto }, { name: t("dashboard.growth"), value: Math.min(100, Math.max(0, growth)) }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTickColor }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartTickColor }} domain={[0, 100]} />
                  <ChartTooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {["#10b981", "#f43f5e", "#8b5cf6"].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="shadow-sm border-0 dark:bg-card lg:col-span-2">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl" />
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-blue-500" />{t("dashboard.recentOrders")}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setLocation("/orders")} className="text-xs gap-1">{t("dashboard.viewAll")} <ChevronLeft className="w-3 h-3 rtl:rotate-180" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-4 pt-2 pb-1">
              <div className="relative max-w-xs">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setOrderPage(0); }} placeholder={t("orders.search")} className="ps-8 h-9 text-xs" />
              </div>
            </div>
            {(() => {
              const filtered = orders.filter(o => !orderSearch || o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) || o.phoneNumber?.includes(orderSearch));
              const totalFilteredPages = Math.max(1, Math.ceil(filtered.length / orderPageSize));
              const paged = filtered.slice(orderPage * orderPageSize, (orderPage + 1) * orderPageSize);
              return (
                <>
                  {paged.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{orderSearch ? t("common.noData") : t("dashboard.noOrders")}</p>
                      {!orderSearch && <Button variant="outline" size="sm" className="mt-3" onClick={() => setLocation("/orders")}>{t("dashboard.newOrder")}</Button>}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-start">{t("orders.customer")}</TableHead>
                            <TableHead className="text-start">{t("orders.phone")}</TableHead>
                            <TableHead className="text-start">{t("orders.amount")}</TableHead>
                            <TableHead className="text-start">{t("orders.status")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paged.map(o => (
                            <TableRow key={o.id}>
                              <TableCell className="font-medium text-foreground">{o.customerName || "-"}</TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground" dir="ltr">{o.phoneNumber || "-"}</TableCell>
                              <TableCell className="font-semibold text-foreground">{fmtCurrency(o.orderAmount || 0, locale)}</TableCell>
                              <TableCell><StatusBadge status={o.status} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {totalFilteredPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">{orderPage * orderPageSize + 1}–{Math.min((orderPage + 1) * orderPageSize, filtered.length)} / {filtered.length}</span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={orderPage === 0} onClick={() => setOrderPage(orderPage - 1)}>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={orderPage >= totalFilteredPages - 1} onClick={() => setOrderPage(orderPage + 1)}>
                          <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-xl" />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500 text-white"><CheckCircle2 className="w-5 h-5" /></div>
              <div><p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{t("dashboard.lowRisk")}</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{analytics?.successfulOrders ?? 0}</p></div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl" />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500 text-white"><FileText className="w-5 h-5" /></div>
              <div><p className="text-xs text-blue-700 dark:text-blue-300 font-medium">{t("sidebar.reports")}</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{analytics?.reportsTotal ?? 0}</p></div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
