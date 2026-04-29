import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { BarChart3, Package, Gift, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export default function Analytics() {
  const [location, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.analytics;
  const dashboardQuery = trpc.merchants.getDashboard.useQuery();
  const profileQuery = trpc.merchants.getProfile.useQuery();

  const { data: reportsResponse } = trpc.reports.list.useQuery({ limit: 100 });
  const reports = reportsResponse?.items ?? [];

  useEffect(() => {
    if (dashboardQuery.isSuccess && dashboardQuery.data === null) {
      setLocation("/merchant-setup");
    }
  }, [dashboardQuery.isSuccess, dashboardQuery.data, setLocation]);

  const analytics = dashboardQuery.data?.analytics;
  const orders = dashboardQuery.data?.orders ?? [];
  const recentOrdersData = analytics?.recentOrdersData ?? [];

  const overviewData =
    recentOrdersData.length > 0
      ? recentOrdersData.map((d: { date: string; count: number }) => ({
          name: d.date,
          orders: Number(d.count),
          points: Number(d.count) * 10,
        }))
      : [
          { name: "السبت", orders: 0, points: 0 },
          { name: "الأحد", orders: 0, points: 0 },
        ];

  const ordersStats = {
    total: analytics?.totalOrders ?? 0,
    success: analytics?.successfulOrders ?? 0,
    failed: (analytics?.totalOrders ?? 0) - (analytics?.successfulOrders ?? 0),
    pending: 0,
  };
  const pointsStats = {
    earned: Math.max(0, (analytics?.successfulOrders ?? 0) * 3),
    converted: Math.max(0, (analytics?.totalOrders ?? 0) * 2),
    balance: profileQuery.data?.creditsBalance ?? 0,
  };
  const reportsStats = {
    total: reports.length,
    accepted: reports.filter((r: any) => r.status === "accepted" || r.status === "verified" || r.status === "success").length,
    pending: reports.filter((r: any) => r.status === "pending").length,
    rejected: reports.filter((r: any) => r.status === "rejected" || r.status === "failed").length,
  };
  const tabFromPath =
    location === "/analytics/orders" ? "orders" :
    location === "/analytics/points" ? "points" :
    location === "/analytics/reports" ? "reports" : "overview";

  if (dashboardQuery.isLoading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (!dashboardQuery.data?.merchant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "الإحصائيات"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "مخططات واتجاهات أداء الطلبات والتحقق"}</p>
        </div>
        <Tabs
          value={tabFromPath}
          onValueChange={(v) => setLocation(v === "overview" ? "/analytics" : `/analytics/${v}`)}
          dir="rtl"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="points">النقاط</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  النشاط الأسبوعي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={overviewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="الطلبات" />
                    <Line type="monotone" dataKey="points" stroke="#10b981" name="النقاط" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">إجمالي الطلبات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{ordersStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">الطلبات الناجحة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{ordersStats.success}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">الفاشلة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{ordersStats.failed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">قيد الانتظار</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{ordersStats.pending}</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  إحصائيات الطلبات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  معدل النجاح: {ordersStats.total ? Math.round((ordersStats.success / ordersStats.total) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="points" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">النقاط المكتسبة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{pointsStats.earned}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">المحولة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{pointsStats.converted}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">الرصيد الحالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{pointsStats.balance}</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  إحصائيات النقاط
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">تحصل على نقاط عند قبول التقارير وعند الإحالات الناجحة.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">إجمالي التقارير</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{reportsStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">المقبولة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{reportsStats.accepted}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">قيد المراجعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{reportsStats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">المرفوضة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{reportsStats.rejected}</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  تقارير الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  معدل القبول: {reportsStats.total ? Math.round((reportsStats.accepted / reportsStats.total) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
