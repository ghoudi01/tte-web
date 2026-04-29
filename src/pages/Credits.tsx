import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import {
  Coins,
  History,
  TrendingUp,
  Phone,
  RefreshCw,
  FileText,
  Users,
  Gift,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import {
  CREDITS,
  CREDIT_REASON_LABELS,
  type CreditReason,
} from "@/credits";
import { trpc } from "@/lib/trpc";

const MOCK_BALANCE = 42;
const MOCK_HISTORY: { id: number; type: "spend" | "earn"; amount: number; reason: CreditReason; date: string }[] = [
  { id: 1, type: "spend", amount: CREDITS.CHECK_PHONE, reason: "check_phone", date: "2024-12-20" },
  { id: 2, type: "earn", amount: CREDITS.REPORT_ACCEPTED, reason: "report_accepted", date: "2024-12-20" },
  { id: 3, type: "earn", amount: CREDITS.REFERRAL_FIRST_CHECK, reason: "referral_first_check", date: "2024-12-19" },
  { id: 4, type: "spend", amount: CREDITS.REFRESH_PHONE, reason: "refresh_phone", date: "2024-12-19" },
  { id: 5, type: "earn", amount: CREDITS.REPORT_ACCEPTED, reason: "report_accepted", date: "2024-12-18" },
  { id: 6, type: "spend", amount: CREDITS.CHECK_PHONE, reason: "check_phone", date: "2024-12-18" },
];

export default function Credits() {
  const [location, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.credits;
  const [balance] = useState(MOCK_BALANCE);
  const tabFromPath =
    location === "/credits/history" ? "history" :
    location === "/credits/earn" ? "earn" : "balance";

  const isLowBalance = balance < CREDITS.LOW_BALANCE_THRESHOLD;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "الاعتمادات"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "رصيدك واستهلاكك وكيفية كسب الاعتمادات"}</p>
        </div>

        {isLowBalance && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">{c?.lowBalanceTitle ?? "رصيدك منخفض"}</p>
                <p className="text-sm text-amber-800">
                  {(c?.lowBalanceMessage ?? "لديك أقل من {threshold} اعتماد. فحص رقم واحد يستهلك {cost} اعتمادات.")
                    .replace("{threshold}", String(CREDITS.LOW_BALANCE_THRESHOLD))
                    .replace("{cost}", String(CREDITS.CHECK_PHONE))}
                </p>
              </div>
              <Button onClick={() => setLocation("/pricing")} size="sm">
                <ShoppingCart className="w-4 h-4 ml-2" />
                {c?.buyCredits ?? "شراء اعتمادات"}
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs
          value={tabFromPath}
          onValueChange={(v) => setLocation(v === "balance" ? "/credits" : `/credits/${v}`)}
          dir="rtl"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="balance">{c?.tabBalance ?? "الرصيد"}</TabsTrigger>
            <TabsTrigger value="history">{c?.tabHistory ?? "سجل الاعتمادات"}</TabsTrigger>
            <TabsTrigger value="earn">{c?.tabEarn ?? "كيفية الكسب"}</TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-4">
            <Card className="border-s-4 border-s-teal-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  رصيدك الحالي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-teal-600">{balance.toLocaleString()}</div>
                <p className="text-sm text-slate-600 mt-1">اعتماد متاح للاستخدام</p>
                <p className="text-xs text-slate-500 mt-1">
                  فحص رقم: {CREDITS.CHECK_PHONE} اعتمادات — إعادة فحص: {CREDITS.REFRESH_PHONE} اعتماد
                </p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => setLocation("/pricing")}>
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    شراء اعتمادات
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/credits/history")}>
                    عرض السجل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  سجل الاعتمادات
                </CardTitle>
                <CardDescription>كل عمليات الاستهلاك والكسب</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {MOCK_HISTORY.map((h) => (
                    <li
                      key={h.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-4"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {h.type === "earn" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 shrink-0" />
                        ) : (
                          <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="text-sm truncate">{CREDIT_REASON_LABELS[h.reason]}</span>
                      </div>
                      <span
                        className={
                          h.type === "earn"
                            ? "text-green-600 font-medium shrink-0"
                            : "text-slate-600 shrink-0"
                        }
                      >
                        {h.type === "earn" ? "+" : "−"}{h.amount}
                      </span>
                      <span className="text-sm text-slate-500 shrink-0">{h.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earn" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  كيفية كسب الاعتمادات
                </CardTitle>
                <CardDescription>ساهم في المنصة واكسب اعتمادات بدون شراء</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <FileText className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">إضافة تقرير مقبول</p>
                    <p className="text-sm text-slate-600">
                      عند قبول تقريرك تحصل على <strong>+{CREDITS.REPORT_ACCEPTED} اعتماد</strong>.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setLocation("/reports/new")}
                    >
                      إضافة تقرير
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <Users className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">الإحالات</p>
                    <p className="text-sm text-slate-600">
                      عندما يُتم المُحال أول تحقق من رقم، تحصل على{" "}
                      <strong>+{CREDITS.REFERRAL_FIRST_CHECK} اعتمادات</strong>.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setLocation("/referrals")}
                    >
                      رابط الإحالة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">استهلاك الاعتمادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>فحص رقم هاتف (أول مرة)</span>
                  </div>
                  <span className="font-medium text-amber-600">−{CREDITS.CHECK_PHONE} اعتماد</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>إعادة فحص نفس الرقم</span>
                  </div>
                  <span className="font-medium text-amber-600">−{CREDITS.REFRESH_PHONE} اعتماد</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
