import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Coins, ShoppingCart, History } from "lucide-react";
import { CREDITS } from "@/credits";
import { trpc } from "@/lib/trpc";

const MOCK_BALANCE = 42;

export default function Subscription() {
  const [, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.subscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "الاشتراك"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "إدارة خطتك واعتماداتك"}</p>
        </div>

        <Card className="border-s-4 border-s-teal-500 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              رصيد الاعتمادات
            </CardTitle>
            <CardDescription>استخدم الاعتمادات لفحص أرقام الهواتف. اكسب اعتمادات بإضافة تقارير أو بالإحالات.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-teal-600 mb-2">{MOCK_BALANCE}</div>
            <p className="text-sm text-slate-600 mb-4">
              فحص رقم: {CREDITS.CHECK_PHONE} اعتمادات — إعادة فحص: {CREDITS.REFRESH_PHONE} اعتماد
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setLocation("/pricing")}>
                <ShoppingCart className="w-4 h-4 ml-2" />
                شراء اعتمادات
              </Button>
              <Button variant="outline" onClick={() => setLocation("/credits")}>
                <History className="w-4 h-4 ml-2" />
                إدارة الاعتمادات
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>كيف يعمل نظام الاعتمادات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p><strong>شراء:</strong> اختر حزمة اعتمادات (50، 150، 400، 1000) — كلما اشتريت أكثر، كان السعر أفضل.</p>
            <p><strong>استهلاك:</strong> فحص رقم لأول مرة = {CREDITS.CHECK_PHONE} اعتمادات. إعادة فحص نفس الرقم = {CREDITS.REFRESH_PHONE} اعتماد.</p>
            <p><strong>كسب:</strong> تقرير مقبول = +{CREDITS.REPORT_ACCEPTED} اعتماد. إحالة تُتم أول تحقق = +{CREDITS.REFERRAL_FIRST_CHECK} اعتمادات.</p>
            <p className="text-slate-500">الاعتمادات لا تنتهي صلاحيتها. عند التسجيل تحصل على {CREDITS.FREE_TRIAL} اعتمادات مجانية.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
