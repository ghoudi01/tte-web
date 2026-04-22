import { useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Phone,
  FileText,
  Plug,
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
  };

  if (dashboardQuery.isLoading || dashboardQuery.isFetching) {
    return (
      <div className="p-6 space-y-4" dir="rtl">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  if (dashboardQuery.error) {
    const isMerchantMissing = (dashboardQuery.error as { data?: { code?: string } })?.data?.code === "NOT_FOUND";
    if (isMerchantMissing) {
      return (
        <div className="p-6" dir="rtl">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p>حساب التاجر غير موجود بعد. أكمل إعداد الحساب للمتابعة.</p>
              <Button onClick={() => setLocation("/merchant-setup")}>
                إكمال إعداد حساب التاجر
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
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
            {dashboard?.pageTitle ?? "لوحة التحكم"}
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
            const Icon = i === 0 ? Phone : i === 1 ? FileText : Plug;
            const variant = i === 0 ? "default" : "outline";
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
    </div>

  );
}
