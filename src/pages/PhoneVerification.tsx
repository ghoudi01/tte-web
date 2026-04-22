import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Coins } from "lucide-react";
import { useLocation } from "wouter";
import { CREDITS } from "@/credits";
import { trpc } from "@/lib/trpc";
import { isValidTunisiaPhone } from "@/lib/phone";

export default function PhoneVerification() {
  const [, setLocation] = useLocation();
  const { data: appContent, isLoading: isAppContentLoading } =
    trpc.automation.getAppContent.useQuery();
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const utils = trpc.useUtils();
  const c = appContent?.phoneVerification;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneToCheck, setPhoneToCheck] = useState<string | null>(null);

  const checkQuery = trpc.phoneVerification.check.useQuery(
    { phoneNumber: phoneToCheck! },
    { enabled: !!phoneToCheck, refetchOnWindowFocus: false }
  );
  const reportVerdictMutation = trpc.phoneVerification.reportVerdict.useMutation();
  const result = checkQuery.data ?? null;
  const isChecking = checkQuery.isFetching;
  const creditsBalance = result?.creditsBalance ?? profileQuery.data?.creditsBalance ?? 0;

  const canCheck = creditsBalance >= CREDITS.CHECK_PHONE;
  const isLowBalance = creditsBalance < CREDITS.LOW_BALANCE_THRESHOLD;
  const isValidPhone = phoneNumber.trim() === "" || isValidTunisiaPhone(phoneNumber);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }
    if (!isValidTunisiaPhone(phoneNumber)) {
      toast.error("رقم الهاتف غير صحيح. هذا الحقل يدعم الأرقام التونسية فقط.");
      return;
    }
    if (!canCheck) {
      toast.error(`رصيدك غير كافٍ. فحص رقم واحد يستهلك ${CREDITS.CHECK_PHONE} اعتمادات.`);
      return;
    }
    setPhoneToCheck(phoneNumber.trim());
  };

  const handleReportVerdict = async (verdict: "spam" | "not_spam") => {
    if (!result?.phoneNumber) {
      toast.error("قم بالتحقق من الرقم أولاً");
      return;
    }
    try {
      await reportVerdictMutation.mutateAsync({
        phoneNumber: result.phoneNumber,
        verdict,
      });
      toast.success(
        verdict === "spam"
          ? "تم تسجيل هذا الرقم كـ SPAM"
          : "تم تسجيل هذا الرقم كـ NOT SPAM"
      );
      await utils.merchants.getProfile.invalidate();
    } catch (error) {
      toast.error("فشل حفظ تقييم الرقم");
    }
  };

  useEffect(() => {
    if (phoneToCheck && checkQuery.isSuccess && checkQuery.data) {
      toast.success("تم التحقق من رقم الهاتف");
    }
    if (phoneToCheck && checkQuery.isError) {
      toast.error("فشل التحقق");
    }
  }, [phoneToCheck, checkQuery.isSuccess, checkQuery.isError, checkQuery.data]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-50 border-green-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "high":
        return "bg-red-50 border-red-200";
      default:
        return "bg-slate-50 border-slate-200";
    }
  };

  if (isAppContentLoading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[420px] lg:col-span-2" />
            <Skeleton className="h-[420px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "التحقق من الهاتف"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "تحقق من رقم عميل واحصل على درجة الثقة"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>فحص رقم الهاتف</CardTitle>
                <CardDescription>أدخل رقم هاتف المشتري للتحقق من سجله. كل فحص يستهلك {CREDITS.CHECK_PHONE} اعتمادات (إعادة فحص نفس الرقم: {CREDITS.REFRESH_PHONE} اعتماد).</CardDescription>
                <div className="flex items-center justify-between mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-sm text-slate-600">رصيد الاعتمادات</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Coins className="w-4 h-4 text-teal-600" />
                    {creditsBalance}
                  </span>
                </div>
                {isLowBalance && (
                  <p className="text-sm text-amber-700 mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    رصيدك منخفض. <button type="button" className="underline font-medium" onClick={() => setLocation("/pricing")}>شراء اعتمادات</button>
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={!isValidPhone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      required
                    />
                    {!isValidPhone && (
                      <p className="text-xs text-red-500">الرجاء إدخال رقم تونسي صالح (8 أرقام).</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isChecking || !canCheck} className="w-full">
                    {isChecking ? "جاري التحقق..." : canCheck ? `التحقق الآن (−${CREDITS.CHECK_PHONE} اعتماد)` : "رصيد غير كافٍ"}
                  </Button>
                </form>

                {/* Features */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-slate-900">مميزات التحقق:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">فحص السجل التاريخي</p>
                        <p className="text-sm text-slate-600">تحقق من سجل المشتري مع تجار آخرين</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">حساب درجة الثقة</p>
                        <p className="text-sm text-slate-600">احصل على درجة ثقة من 0 إلى 100</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">تقييم المخاطر</p>
                        <p className="text-sm text-slate-600">تعرف على مستوى المخاطرة (منخفضة/متوسطة/عالية)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result Panel */}
          <div>
            {result ? (
              <Card className={`border-2 ${getRiskBgColor(result.riskLevel)}`}>
                <CardHeader>
                  <CardTitle className="text-lg">نتائج التحقق</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">رقم الهاتف</p>
                    <p className="font-mono text-slate-900">{result.phoneNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-2">درجة الثقة</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            result.trustScore >= 70
                              ? "bg-green-600"
                              : result.trustScore >= 40
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{ width: `${result.trustScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg">{result.trustScore}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">مستوى المخاطرة</p>
                    <p className={`font-semibold text-lg capitalize ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel === "low" && "منخفضة"}
                      {result.riskLevel === "medium" && "متوسطة"}
                      {result.riskLevel === "high" && "عالية"}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">الطلبات الناجحة</span>
                      <span className="font-semibold">{result.successfulOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">الارتجاعات</span>
                      <span className="font-semibold">{result.rtoCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">تقارير SPAM</span>
                      <span className="font-semibold text-red-600">{result.spamReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">تقارير NOT SPAM</span>
                      <span className="font-semibold text-green-600">{result.notSpamReports}</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border ${getRiskBgColor(result.riskLevel)}`}>
                    <p className="text-sm font-medium">
                      {result.riskLevel === "low" &&
                        "✓ هذا المشتري موثوق. يمكنك المتابعة بثقة."}
                      {result.riskLevel === "medium" &&
                        "⚠ تحقق إضافي مطلوب. قد تحتاج إلى تأكيد إضافي."}
                      {result.riskLevel === "high" &&
                        "✗ مخاطر عالية. يُنصح بعدم المتابعة أو طلب دفع مسبق."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setLocation("/reports/new")}
                    >
                      إضافة تقرير
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={reportVerdictMutation.isPending}
                        onClick={() => handleReportVerdict("spam")}
                      >
                        SPAM
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={reportVerdictMutation.isPending}
                        onClick={() => handleReportVerdict("not_spam")}
                      >
                        NOT SPAM
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">أدخل رقم هاتف لعرض النتائج</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
