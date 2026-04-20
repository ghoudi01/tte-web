import { useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  FileText,
  Plug,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function fmtCurrency(value: number) {
  return new Intl.NumberFormat("ar-TN", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const dashboardQuery = trpc.merchants.getDashboard.useQuery();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const dashboard = appContent?.dashboard;
  const cards = dashboard?.cards;
  const defaultQuickActions: { id: string; label: string; path: string }[] = [
    { id: "phone-verification", label: "تحقق من رقم", path: "/phone-verification" },
    { id: "reports", label: "إضافة تقرير", path: "/reports" },
    { id: "plugins", label: "إدارة الإضافات", path: "/plugins" },
    { id: "innovation", label: "أفكار MVP", path: "/innovation-lab" },
  ];
  const actionsToShow: { id: string; label: string; path: string }[] =
    dashboard?.quickActions && dashboard.quickActions.length > 0
      ? dashboard.quickActions.map(a => ({ id: a.id, label: a.label, path: a.path }))
      : defaultQuickActions;

  const merchant = dashboardQuery.data?.merchant ?? null;
  const orders = dashboardQuery.data?.orders ?? [];
  const analytics = dashboardQuery.data?.analytics;

  const stats = useMemo(() => {
    const totalOrders = analytics?.totalOrders ?? 0;
    const successRate = Math.round(analytics?.successRate ?? 0);
    const rtoRate = Math.round(analytics?.rtoRate ?? 0);
    const revenue = orders.reduce((sum, o) => sum + (o.orderAmount ?? 0), 0);
    return { totalOrders, successRate, rtoRate, revenue };
  }, [analytics, orders]);

  const quickActionLabels: Record<string, string> = {
    "phone-verification": "تحقق من رقم",
    reports: "إضافة تقرير",
    plugins: "إدارة الإضافات",
    innovation: "أفكار MVP",
  };

  if (dashboardQuery.isLoading || dashboardQuery.isFetching) {
    return (
      <div className="p-6" dir="rtl">
        {dashboard?.loadingText ?? "جاري تحميل لوحة التحكم..."}
      </div>
    );
  }

  if (dashboardQuery.error) {
    return (
      <div className="p-6" dir="rtl">
        <Card>
          <CardContent className="pt-6">
            {dashboard?.errorText ?? "تعذر تحميل البيانات. حاول مرة أخرى."}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {dashboard?.pageTitle ?? "لوحة تحكم مبسطة"}
          </h1>
          <p className="text-slate-600">
            {dashboard?.pageSubtitle ?? "كل ما تحتاجه اليوم في مكان واحد."}
          </p>
        </div>
        <Badge className="bg-emerald-600">
          {merchant?.businessName || (dashboard?.merchantBadge ?? "حساب التاجر")}
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-600">
              {cards?.totalOrders ?? "إجمالي الطلبات"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black">
            {stats.totalOrders}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-600">
              {cards?.successRate ?? "نسبة النجاح"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-emerald-600">
            {stats.successRate}%
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-600">
              {cards?.rto ?? "RTO"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-rose-600">
            {stats.rtoRate}%
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-600">
              {cards?.revenue ?? "الإيرادات"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">
            {fmtCurrency(stats.revenue)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{cards?.quickActions ?? "إجراءات سريعة"}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {actionsToShow.map((action, i) => {
            const label = action.label ?? quickActionLabels[action.id] ?? action.id;
            const path = action.path ?? "/dashboard";
            const Icon = i === 0 ? Phone : i === 1 ? FileText : i === 2 ? Plug : Sparkles;
            const variant = i === 0 ? "default" : i === 3 ? "secondary" : "outline";
            return (
              <Button
                key={path + i}
                onClick={() => setLocation(path)}
                variant={variant as "default" | "outline" | "secondary"}
                className="justify-between"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" /> {label}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> {cards?.recentOrders ?? "آخر الطلبات"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {orders.slice(0, 6).map(o => (
              <div
                key={o.id}
                className="flex items-center justify-between border rounded-lg p-2"
              >
                <span className="font-mono">{o.phoneNumber || "-"}</span>
                <span>{fmtCurrency(o.orderAmount || 0)}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-slate-500">{cards?.noOrders ?? "لا توجد طلبات بعد."}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{cards?.riskSummary ?? "ملخص المخاطر"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />{" "}
                {cards?.lowRiskOrders ?? "طلبات منخفضة المخاطر"}
              </span>
              <b>
                {Math.max(
                  0,
                  Math.round(stats.totalOrders * (stats.successRate / 100))
                )}
              </b>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />{" "}
                {cards?.needsReview ?? "طلبات تحتاج مراجعة"}
              </span>
              <b>{Math.max(0, Math.round(stats.totalOrders * 0.2))}</b>
            </div>
            <p className="text-slate-500">
              {cards?.tip ?? "نصيحة: فعّل قواعد \"السياسة التلقائية\" من صفحات MVP لتقليل الـ RTO."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
