import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Bot,
  Brain,
  CreditCard,
  GitBranch,
  Languages,
  Lightbulb,
  LineChart,
  Link2,
  MessageCircle,
  Network,
  Route,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const trustEvents = [
  { date: "2026-02-01", reason: "تم استلام تقرير جديد", delta: -12 },
  { date: "2026-02-03", reason: "تحقق هاتف ناجح", delta: +8 },
  { date: "2026-02-05", reason: "تكرار إرجاع في نفس المنطقة", delta: -6 },
  { date: "2026-02-07", reason: "تحديث بيانات عميل", delta: +4 },
];

const pluginHealth = [
  { name: "Meta Webhook", success: "99.2%", lastEvent: "منذ 2 دقيقة" },
  { name: "Zapier", success: "97.1%", lastEvent: "منذ 10 دقائق" },
  { name: "WhatsApp Bot", success: "95.6%", lastEvent: "منذ 1 دقيقة" },
];

const ideaStatuses = [
  "Trust Score Why Timeline",
  "Auto Policy Engine",
  "Risk-aware Payment Options",
  "Merchant Benchmarking",
  "Report Reputation Tiers",
  "Credit Auto Recharge",
  "Fraud Pattern Alerts",
  "DM to Verified Order Inbox",
  "Smart Link in Bio Form",
  "Plugin Health Dashboard",
  "API Partner Mode",
  "Arabic UX Optimization",
];

export default function InnovationLab() {
  const { user } = useAuth();
  const [threshold, setThreshold] = useState(40);
  const [autoRecharge, setAutoRecharge] = useState(true);
  const [query, setQuery] = useState("order 21622123456 199");
  const [demoRegion, setDemoRegion] = useState("Tunis");

  const parsed = useMemo(() => {
    const parts = query.trim().split(/\s+/);
    const phone = parts[1] ?? "21622123456";
    const amount = Number(parts[2]) || 199;
    return {
      type: parts[0] || "order",
      phone,
      amount,
    };
  }, [query]);

  const { data: merchantConfig } = trpc.automation.getMerchantConfig.useQuery(
    undefined,
    { enabled: !!user }
  );
  const effectiveThreshold = merchantConfig?.trustThresholdForDeposit ?? 40;

  const { data: orderDecision, isFetching: decisionLoading } =
    trpc.automation.simulateOrderDecision.useQuery(
      {
        phoneNumber: parsed.phone,
        amount: parsed.amount,
        region: demoRegion,
      },
      { enabled: !!user && parsed.phone.length >= 6 }
    );

  const { data: whatsappMessage } =
    trpc.automation.buildWhatsAppMessage.useQuery(
      { phoneNumber: parsed.phone, orderAmount: parsed.amount },
      { enabled: parsed.phone.length >= 6 && parsed.amount > 0 }
    );

  const { data: trustExplanation } =
    trpc.automation.explainTrustScore.useQuery(
      {
        trustScore: orderDecision?.trustScore ?? 50,
        rtoCount: 0,
        successfulOrders: 0,
      },
      { enabled: !!orderDecision }
    );

  const { data: recommendedCarrier } =
    trpc.automation.recommendShipping.useQuery(
      {
        trustScore: orderDecision?.trustScore ?? 50,
        region: demoRegion,
        availableCarriers: [
          { name: "Rapid-Poste", coverage: "وطنية" },
          { name: "Tunisia Express", coverage: "المدينة" },
          { name: "Aramex Tunisia", coverage: "محلي + دولي" },
        ],
      },
      { enabled: !!orderDecision }
    );

  const { data: growthTips = [] } = trpc.automation.getGrowthTips.useQuery(
    undefined,
    { enabled: !!user }
  );

  const utils = trpc.useUtils();
  const updateConfig = trpc.automation.updateMerchantConfig.useMutation({
    onSuccess: (_, variables) => {
      utils.automation.getMerchantConfig.invalidate();
      if (variables.trustThresholdForDeposit != null)
        setThreshold(variables.trustThresholdForDeposit);
    },
  });
  const syncThreshold = effectiveThreshold !== threshold ? threshold : null;

  const benchmarkDelta = -3;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            مختبر الابتكار — تنفيذ 12 فكرة
          </h1>
          <p className="text-slate-600">
            نسخة MVP تفاعلية لقياس القيمة قبل الدمج الكامل مع الـ API.
          </p>
        </div>
        <Badge className="bg-teal-600">12/12 أفكار مفعلة</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> 1) Timeline تفسير درجة الثقة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {trustEvents.map(e => (
              <div
                key={e.date}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <span>{e.reason}</span>
                <span
                  className={
                    e.delta >= 0 ? "text-emerald-600" : "text-rose-600"
                  }
                >
                  {e.delta >= 0 ? `+${e.delta}` : e.delta}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> 2) محرك سياسات تلقائي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              إذا كانت الثقة أقل من <b>{effectiveThreshold}</b> يتم طلب عربون
              تلقائياً.
            </p>
            <Input
              type="range"
              min={20}
              max={80}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
            />
            <Button
              size="sm"
              disabled={!user || syncThreshold === null}
              onClick={() =>
                syncThreshold !== null &&
                updateConfig.mutate({
                  trustThresholdForDeposit: syncThreshold,
                })
              }
            >
              {updateConfig.isPending ? "جاري الحفظ…" : "حفظ السياسة"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> 3) خيارات دفع حسب المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="rounded-lg border p-2">ثقة 35 → عربون 20%</div>
            <div className="rounded-lg border p-2">
              ثقة 58 → COD مع تأكيد واتساب
            </div>
            <div className="rounded-lg border p-2">ثقة 78 → شحن فوري</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-4 h-4" /> 4) مقارنة أداء التاجر
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>RTO لديك 14% مقابل متوسط السوق 11%.</p>
            <p
              className={
                benchmarkDelta < 0 ? "text-rose-600" : "text-emerald-600"
              }
            >
              الفارق: {benchmarkDelta}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> 5) سمعة البلاغات
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <Badge>Tier: Silver</Badge>
            <p>قبول البلاغات: 87%</p>
            <p>مكافأة الجودة: +1.2x credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> 6) شحن اعتمادات تلقائي
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span>تفعيل إعادة الشحن</span>
              <Switch
                checked={autoRecharge}
                onCheckedChange={setAutoRecharge}
              />
            </div>
            <p>عند أقل من 10 credits → شراء باقة Starter تلقائياً.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> 7) تنبيهات أنماط احتيال
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>تم رصد 3 طلبات مترابطة بنفس الجهاز + المنطقة خلال 24 ساعة.</p>
            <Badge variant="destructive">تنبيه مرتفع</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-4 h-4" /> 8) قرار الطلب + واتساب (Backend)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <Input value={query} onChange={e => setQuery(e.target.value)} />
            <div className="rounded-lg border p-2">
              Type: {parsed.type} | Phone: {parsed.phone} | Amount:{" "}
              {parsed.amount}
            </div>
            {user && (
              <>
                <Input
                  placeholder="المنطقة (مثلاً Tunis)"
                  value={demoRegion}
                  onChange={e => setDemoRegion(e.target.value)}
                />
                {decisionLoading ? (
                  <p className="text-slate-500">جاري المحاكاة…</p>
                ) : orderDecision ? (
                  <div className="space-y-2 rounded-lg border p-2 bg-slate-50">
                    <p>
                      درجة الثقة: <b>{orderDecision.trustScore}%</b> — مخاطر:{" "}
                      {orderDecision.riskLevel}
                    </p>
                    <p>
                      عربون:{" "}
                      {orderDecision.requireDeposit ? "مطلوب" : "غير مطلوب"} |
                      شركة الشحن: {orderDecision.recommendedShippingCompany}
                    </p>
                    <ul className="list-disc list-inside text-xs">
                      {orderDecision.decisionReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {trustExplanation && (
                  <div className="rounded-lg border p-2">
                    <ShieldCheck className="w-4 h-4 inline mr-1" />
                    شرح الثقة: مستوى {trustExplanation.level} —{" "}
                    {trustExplanation.reasons.join(" | ")}
                  </div>
                )}
                {recommendedCarrier && (
                  <div className="rounded-lg border p-2">
                    <Route className="w-4 h-4 inline mr-1" />
                    شركة الشحن المقترحة: {recommendedCarrier}
                  </div>
                )}
              </>
            )}
            {whatsappMessage && (
              <div className="rounded-lg border p-2 bg-emerald-50">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                رسالة واتساب: &quot;{whatsappMessage}&quot;
              </div>
            )}
            <Button size="sm">إنشاء طلب مؤكد</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-4 h-4" /> 9) Smart Link in Bio Form
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>يدعم prefill + اقتراح إجراء حسب الخطر.</p>
            <code className="block rounded bg-slate-100 p-2 text-xs">
              /report?phone=21622123456&amount=120
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-4 h-4" /> 10) لوحة صحة الإضافات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {pluginHealth.map(p => (
              <div
                key={p.name}
                className="rounded-lg border p-2 flex items-center justify-between"
              >
                <span>{p.name}</span>
                <span>
                  {p.success} • {p.lastEvent}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-4 h-4" /> 11) API Partner Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Multi-tenant API keys + usage billing + agency dashboards.</p>
            <Button size="sm" variant="outline">
              إنشاء Partner Key
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-4 h-4" /> 12) Arabic UX Pack
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>تحسين line-height، تنسيق الأرقام، وتحسين microcopy العربي.</p>
            <div className="rounded-lg border p-2">
              السعر: 129.99 د.ت • معدل الارتجاع: 11.4%
            </div>
          </CardContent>
        </Card>
      </div>

      {user && growthTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> نصائح نمو (IA)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-2 text-sm">
            {growthTips.map(tip => (
              <div
                key={tip.id}
                className={`rounded-lg border p-2 ${
                  tip.priority === "high"
                    ? "border-amber-200 bg-amber-50"
                    : tip.priority === "medium"
                      ? "border-slate-200 bg-slate-50"
                      : "border-slate-100"
                }`}
              >
                <p className="font-medium">{tip.title}</p>
                <p className="text-slate-600 text-xs mt-1">{tip.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> حالة التنفيذ
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-2 text-sm">
          {ideaStatuses.map(item => (
            <div
              key={item}
              className="rounded-lg border p-2 flex items-center justify-between"
            >
              <span>{item}</span>
              <Badge variant="secondary">MVP</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
