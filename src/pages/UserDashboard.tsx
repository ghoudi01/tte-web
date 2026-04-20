import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Users,
  Gift,
  Copy,
  Share2,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  Activity,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useLocation } from "wouter";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  // Static data - in real implementation, this would come from API
  const [notifications] = useState([
    { id: 1, type: "success", message: "تم قبول تقريرك", time: "منذ ساعتين", read: false },
    { id: 2, type: "info", message: "حصلت على 50 نقطة", time: "منذ 5 ساعات", read: false },
    { id: 3, type: "warning", message: "تقريرك قيد المراجعة", time: "منذ يوم", read: true },
  ]);

  const [recentActivity] = useState([
    { id: 1, type: "report", action: "إنشاء تقرير", client: "أحمد محمد", time: "منذ ساعتين", status: "success" },
    { id: 2, type: "points", action: "كسب نقاط", amount: 50, time: "منذ 5 ساعات", status: "success" },
    { id: 3, type: "referral", action: "إحالة جديدة", user: "محمد علي", time: "منذ يوم", status: "pending" },
    { id: 4, type: "report", action: "إنشاء تقرير", client: "فاطمة أحمد", time: "منذ يومين", status: "pending" },
  ]);

  const stats = {
    totalReports: 24,
    pointsEarned: 1250,
    referrals: 8,
    pointsBalance: 850,
  };

  const referralLink = "https://tte.tn/ref/ABC123XYZ";
  const userProfile = {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+216 XX XXX XXX",
    joinDate: "يناير 2024",
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("تم نسخ رابط الإحالة");
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">لوحة التحكم</h1>
          <p className="text-lg text-slate-600">مرحباً {userProfile.name} 👋</p>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                إجمالي التقارير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalReports}</div>
              <p className="text-xs text-slate-500 mt-1">منذ البداية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Award className="w-4 h-4" />
                النقاط المكتسبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.pointsEarned.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">نقطة إجمالية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                الإحالات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.referrals}</div>
              <p className="text-xs text-slate-500 mt-1">مستخدم محال</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                رصيد النقاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.pointsBalance.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">نقطة متاحة</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {userProfile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">رقم الهاتف:</span>
                  <span className="font-medium">{userProfile.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تاريخ الانضمام:</span>
                  <span className="font-medium">{userProfile.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الحالة:</span>
                  <Badge variant="default">نشط</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setLocation("/settings")}>
                تعديل الملف الشخصي
              </Button>
            </CardContent>
          </Card>

          {/* Points Balance & Referral Link */}
          <Card>
            <CardHeader>
              <CardTitle>النقاط ورابط الإحالة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Points Balance */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-900">رصيد النقاط</span>
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-2">
                  {stats.pointsBalance.toLocaleString()}
                </div>
                <p className="text-xs text-purple-700">نقطة متاحة للتحويل</p>
                <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700" onClick={() => setLocation("/points/convert")}>
                  تحويل إلى أموال
                </Button>
              </div>

              <Separator />

              {/* Referral Link */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">رابط الإحالة</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyReferralLink}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    مشاركة
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  احصل على نقاط عند إحالة مستخدمين جدد
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Center */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>الإشعارات</CardTitle>
                {unreadNotifications > 0 && (
                  <Badge variant="destructive">{unreadNotifications}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      !notification.read ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.type === "success" && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      )}
                      {notification.type === "warning" && (
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      )}
                      {notification.type === "info" && (
                        <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                عرض جميع الإشعارات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
              <CardDescription>الوصول السريع إلى الميزات الرئيسية</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setLocation("/reports/new")}>
                  <FileText className="w-6 h-6" />
                  <span>تقرير جديد</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setLocation("/analytics")}>
                  <Activity className="w-6 h-6" />
                  <span>النشاط</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setLocation("/points/convert")}>
                  <Gift className="w-6 h-6" />
                  <span>تحويل النقاط</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setLocation("/referrals")}>
                  <LinkIcon className="w-6 h-6" />
                  <span>رابط الإحالة</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>آخر الإجراءات والأنشطة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.status === "success" ? "bg-green-100" :
                      activity.status === "pending" ? "bg-yellow-100" : "bg-slate-100"
                    }`}>
                      {activity.type === "report" && <FileText className="w-4 h-4 text-green-600" />}
                      {activity.type === "points" && <Award className="w-4 h-4 text-green-600" />}
                      {activity.type === "referral" && <Users className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {activity.action}
                        {activity.client && ` - ${activity.client}`}
                        {activity.user && ` - ${activity.user}`}
                        {activity.amount && ` (+${activity.amount} نقطة)`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        {activity.status === "success" && (
                          <Badge variant="default" className="text-xs">نجح</Badge>
                        )}
                        {activity.status === "pending" && (
                          <Badge variant="outline" className="text-xs">قيد الانتظار</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                عرض جميع الأنشطة
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


