import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Link as LinkIcon, Users, BarChart3, Copy, Share2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Referrals() {
  const [location, setLocation] = useLocation();
  const { data: appContent, isLoading: isAppLoading } =
    trpc.automation.getAppContent.useQuery();
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const ordersQuery = trpc.orders.list.useQuery({ limit: 50 });
  const c = appContent?.referrals;
  const tabFromPath =
    location === "/referrals/users" ? "users" :
    location === "/referrals/stats" ? "stats" : "link";

  const referredUsers = (ordersQuery.data ?? [])
    .filter((o) => !!o.clientName)
    .slice(0, 12)
    .map((o) => ({
      id: o.id,
      name: o.clientName || "مستخدم",
      email: "-",
      joinDate: new Date(o.createdAt).toLocaleDateString("ar-TN"),
      creditsEarned: o.verificationStatus === "verified" ? 3 : 0,
    }));
  const referralLink = profileQuery.data?.apiKey
    ? `${window.location.origin}/register?ref=${profileQuery.data.apiKey}`
    : `${window.location.origin}/register`;
  const stats = {
    totalReferrals: referredUsers.length,
    activeUsers: referredUsers.filter((u) => u.creditsEarned > 0).length,
    totalCreditsEarned: referredUsers.reduce((sum, u) => sum + u.creditsEarned, 0),
  };

  if (isAppLoading || profileQuery.isLoading || ordersQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("تم نسخ رابط الإحالة");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "الإحالات"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "ادعُ تجاراً آخرين واكسب اعتمادات"}</p>
        </div>
        <Tabs value={tabFromPath} onValueChange={(v) => setLocation(v === "link" ? "/referrals" : `/referrals/${v}`)} dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">رابط الإحالة</TabsTrigger>
            <TabsTrigger value="users">المستخدمون المحالون</TabsTrigger>
            <TabsTrigger value="stats">إحصائيات</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  رابط الإحالة
                </CardTitle>
                <CardDescription>شارك هذا الرابط مع أصدقائك. تحصل على 3 اعتمادات عندما يُتم المُحال أول تحقق من رقم.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input value={referralLink} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    مشاركة
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  المستخدمون المحالون
                </CardTitle>
                <CardDescription>{referredUsers.length} مستخدم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" dir="rtl">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                        <th className="text-right py-3 px-4 font-semibold">البريد</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ الانضمام</th>
                        <th className="text-right py-3 px-4 font-semibold">اعتمادات مكتسبة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{u.name}</td>
                          <td className="py-3 px-4">{u.email}</td>
                          <td className="py-3 px-4">{u.joinDate}</td>
                          <td className="py-3 px-4 text-green-600">+{u.creditsEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">إجمالي الإحالات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stats.totalReferrals}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">مستخدمون نشطون</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.activeUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">اعتمادات مكتسبة من الإحالات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{stats.totalCreditsEarned}</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  ملخص
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  عند إحالة مستخدم جديد وإتمامه أول تحقق من رقم هاتف، تحصل على 3 اعتمادات. يمكنك استخدام الاعتمادات لفحص أرقام أو شراء المزيد.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
