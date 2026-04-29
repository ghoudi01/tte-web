import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Check, Coins, Zap } from "lucide-react";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { CREDIT_PACKS } from "@/credits";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const handleBuyClick = () => {
    if (isAuthenticated) {
      toast.info("دفع الاعتمادات قريباً");
      setLocation("/credits");
    } else {
      setLocation("/register?redirect=/pricing");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" dir="rtl">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12" dir="rtl">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">شراء الاعتمادات</h1>
            <p className="text-lg text-slate-600">
              اشترِ اعتمادات واستخدمها للتحقق من أرقام الهواتف. كلما اشتريت أكثر، كان السعر أفضل.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card className="border-teal-200 bg-teal-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">شراء</p>
                    <p className="text-sm text-slate-600">اشترِ حزمة اعتمادات تناسبك</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">استهلاك</p>
                    <p className="text-sm text-slate-600">فحص رقم: 5 اعتمادات — إعادة فحص: 2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">كسب</p>
                    <p className="text-sm text-slate-600">تقرير مقبول: +2 — إحالة أول تحقق: +3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKS.map((pack) => {
              const totalCredits = pack.bonusPercent
                ? pack.credits + Math.floor((pack.credits * pack.bonusPercent) / 100)
                : pack.credits;
              return (
                <Card
                  key={pack.id}
                  className={pack.highlighted ? "border-2 border-primary shadow-lg" : ""}
                >
                  <CardHeader>
                    {pack.highlighted && (
                      <Badge className="w-fit mb-2">الأكثر طلباً</Badge>
                    )}
                    <CardTitle className="text-xl" dir="rtl">{pack.name}</CardTitle>
                    <CardDescription dir="rtl">{pack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-slate-900">{pack.priceTND}</span>
                      <span className="text-slate-600">د.ت</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">{totalCredits}</span> اعتماد
                      {pack.bonusPercent ? (
                        <span className="text-emerald-600"> (+{pack.bonusPercent}% مكافأة)</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">
                      ~{pack.perCredit.toFixed(2)} د.ت/اعتماد
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        فحص رقم: 5 اعتمادات
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        إعادة فحص: 2 اعتماد
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        الاعتمادات لا تنتهي صلاحيتها
                      </li>
                    </ul>
                     <Button
                       className="w-full"
                       variant={pack.highlighted ? "default" : "outline"}
                       onClick={handleBuyClick}
                     >
                       شراء الاعتمادات
                     </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8" dir="rtl">
            عند التسجيل تحصل على 10 اعتمادات مجانية لتجربة الخدمة.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
