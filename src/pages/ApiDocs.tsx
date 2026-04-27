import { useLocation } from "wouter";
import { useState } from "react";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronLeft,
  Key,
  Globe,
  FileJson,
  AlertCircle,
  Zap,
  BookOpen,
  Lightbulb,
  GitBranch,
  HelpCircle,
} from "lucide-react";
import {
  EndpointDetails,
  type ApiEndpoint,
} from "./api-docs/components/EndpointDetails";

const BASE_URL = "https://api.tte.tn/v1";

const SIDEBAR_SECTIONS = [
  { id: "introduction", label: "المقدمة" },
  { id: "getting-started", label: "البدء السريع" },
  { id: "authentication", label: "المصادقة" },
  { id: "base-url", label: "العنوان الأساسي" },
  { id: "request-response", label: "صيغة الطلب والاستجابة" },
  {
    id: "verify",
    label: "التحقق",
    children: [
      { id: "verify-phone", label: "إرسال OTP", method: "POST" },
      { id: "verify-confirm", label: "تأكيد OTP", method: "POST" },
    ],
  },
  {
    id: "orders",
    label: "الطلبات",
    children: [
      { id: "orders-score", label: "حساب درجة الثقة", method: "POST" },
      { id: "orders-get", label: "استعلام طلب", method: "GET" },
    ],
  },
  { id: "schemas", label: "الأنواع والقيم" },
  { id: "rate-limits", label: "حدود الطلبات" },
  { id: "errors", label: "أكواد الأخطاء" },
  { id: "use-cases", label: "حالات الاستخدام" },
  { id: "best-practices", label: "أفضل الممارسات" },
  { id: "code-examples", label: "أمثلة كود" },
  { id: "postman", label: "Postman" },
  { id: "faq", label: "الأسئلة الشائعة" },
  { id: "changelog", label: "سجل التغييرات" },
];

const ENDPOINTS: Record<string, ApiEndpoint> = {
  "verify-phone": {
    method: "POST",
    path: "/verify/phone",
    title: "إرسال رمز التحقق (OTP)",
    desc: "يرسل رمز OTP إلى رقم الهاتف المُدخل ويرجع معرف جلسة التحقق (session_id) لاستخدامه في تأكيد التحقق.",
    body: `{
  "phone": "+216 XX XXX XXX",
  "locale": "ar"
}`,
    response: `{
  "session_id": "sess_abc123",
  "expires_in": 300,
  "message": "تم إرسال الرمز"
}`,
    params: [
      { name: "phone", type: "string", desc: "رقم الهاتف بالتنسيق الدولي (مثلاً +216...)" },
      { name: "locale", type: "string", desc: "اختياري: ar أو fr أو en" },
    ],
  },
  "verify-confirm": {
    method: "POST",
    path: "/verify/confirm",
    title: "تأكيد التحقق",
    desc: "يتحقق من رمز OTP المدخل من المستخدم ويُكمل عملية التحقق. عند النجاح يمكن ربط الطلبات بدرجة الثقة.",
    body: `{
  "session_id": "sess_abc123",
  "code": "123456"
}`,
    response: `{
  "verified": true,
  "phone": "+216 XX XXX XXX",
  "trust_eligible": true
}`,
    params: [
      { name: "session_id", type: "string", desc: "معرف الجلسة من استجابة إرسال OTP" },
      { name: "code", type: "string", desc: "رمز OTP المُدخل من المستخدم" },
    ],
  },
  "orders-score": {
    method: "POST",
    path: "/orders/score",
    title: "حساب درجة الثقة للطلب",
    desc: "يحسب درجة الثقة ومستوى المخاطر لطلب بناءً على رقم الهاتف ومبلغ الطلب. يُستخدم قبل الشحن لاتخاذ قرار القبول أو الطلب تحقق إضافي.",
    body: `{
  "phone": "+216 XX XXX XXX",
  "order_id": "ORD-123",
  "amount": 150.00,
  "currency": "TND"
}`,
    response: `{
  "order_id": "ORD-123",
  "trust_score": 0.85,
  "risk_level": "low",
  "recommendation": "ship",
  "details": { "phone_verified": true, "history_orders": 3 }
}`,
    params: [
      { name: "phone", type: "string", desc: "رقم هاتف المشتري" },
      { name: "order_id", type: "string", desc: "معرف الطلب في نظامك" },
      { name: "amount", type: "number", desc: "مبلغ الطلب" },
      { name: "currency", type: "string", desc: "العملة، مثلاً TND" },
    ],
  },
  "orders-get": {
    method: "GET",
    path: "/orders/:orderId",
    title: "استعلام حالة الطلب",
    desc: "يعيد تفاصيل التحقق ودرجة الثقة لطلب معيّن إذا كان قد تم تقييمه مسبقاً.",
    response: `{
  "order_id": "ORD-123",
  "trust_score": 0.85,
  "risk_level": "low",
  "verified_at": "2024-01-15T10:30:00Z"
}`,
    params: [
      { name: "orderId", type: "path", desc: "معرف الطلب (في المسار)" },
    ],
  },
};

const ERROR_CODES = [
  { code: 400, meaning: "طلب غير صالح — تحقق من الجسم أو المعاملات." },
  { code: 401, meaning: "مفتاح API مفقود أو غير صالح." },
  { code: 403, meaning: "غير مصرح — المفتاح لا يملك الصلاحية." },
  { code: 404, meaning: "المورد غير موجود." },
  { code: 429, meaning: "تجاوز حد الطلبات — جرّب لاحقاً." },
  { code: 500, meaning: "خطأ داخلي في الخادم." },
];

export default function ApiDocs() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ verify: true, orders: true });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      <Navigation />

      <div className="flex border-t border-slate-200">
        {/* Sidebar - Medusa-style */}
        <aside className="hidden lg:block w-64 shrink-0 border-l border-slate-200 bg-slate-50/50">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <nav className="p-4 space-y-1 text-sm">
              {SIDEBAR_SECTIONS.map((section) =>
                "children" in section ? (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleGroup(section.id)}
                      className="flex items-center justify-between w-full py-2 px-3 rounded-md text-slate-700 hover:bg-slate-200/80 font-medium"
                    >
                      {section.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openGroups[section.id] ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openGroups[section.id] !== false && (
                      <div className="mr-3 mt-1 space-y-0.5 border-r border-slate-200 pr-2">
                        {(section as { children: { id: string; label: string; method: string }[] }).children.map(
                          (child) => (
                            <button
                              key={child.id}
                              onClick={() => scrollTo(child.id)}
                              className="flex items-center gap-2 w-full py-1.5 px-3 rounded text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                            >
                              <span
                                className={
                                  child.method === "GET"
                                    ? "text-emerald-600 font-mono text-xs"
                                    : "text-amber-600 font-mono text-xs"
                                }
                              >
                                {child.method}
                              </span>
                              {child.label}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-md text-slate-700 hover:bg-slate-200/80 font-medium text-right"
                  >
                    {section.label}
                  </button>
                )
              )}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            {/* Introduction - no hero */}
            <section id="introduction" className="scroll-mt-24 mb-14">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">المقدمة</h1>
              <p className="text-slate-600 leading-relaxed mb-4">
                يشمل مرجع API هذا نقاط النهاية الخاصة بـ Tunisia Trust Engine، وهي واجهة REST تُستخدم للتحقق من
                أرقام الهواتف وحساب درجات الثقة والمخاطر للطلبات في سياق التجارة الإلكترونية (مثلاً تقليل
                الارتجاعات والاحتيال).
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                جميع النقاط لها البادئة <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-sm">{BASE_URL}</code>.
                أثناء التطوير يمكنك استخدام بيئة الاختبار؛ للإنتاج استبدل العنوان بعنوان الخادم الفعلي.
              </p>
              <p className="text-slate-600 leading-relaxed">
                يمكنك إرسال الطلبات باستخدام cURL أو Postman أو أي عميل HTTP. راجع قسم Postman أدناه لاستيراد
                المجموعة وتجربة النقاط بسرعة.
              </p>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                البدء السريع
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                اتبع هذه الخطوات لتجربة الـ API خلال دقائق:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-slate-600 mb-4">
                <li><strong className="text-slate-800">إنشاء حساب:</strong> سجّل في الموقع واحصل على مفتاح API من لوحة التحكم → الإعدادات → API.</li>
                <li><strong className="text-slate-800">اختيار البيئة:</strong> استخدم Base URL للاختبار أو الإنتاج حسب خطة اشتراكك.</li>
                <li><strong className="text-slate-800">أول طلب:</strong> أضف الترويسة <code className="bg-slate-100 px-1 rounded text-sm">Authorization: Bearer YOUR_API_KEY</code> ثم استدعِ مثلاً <code className="bg-slate-100 px-1 rounded text-sm">POST /orders/score</code> مع رقم هاتف ومبلغ الطلب.</li>
                <li><strong className="text-slate-800">تفسير النتيجة:</strong> استخدم <code className="bg-slate-100 px-1 rounded text-sm">trust_score</code> و <code className="bg-slate-100 px-1 rounded text-sm">risk_level</code> و <code className="bg-slate-100 px-1 rounded text-sm">recommendation</code> لاتخاذ قرار الشحن أو طلب تحقق إضافي.</li>
              </ol>
            </section>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Key className="w-5 h-5" />
                المصادقة (Authentication)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                يجب إرفاق مفتاح API في ترويسة الطلب. تحصل على المفتاح من لوحة التحكم بعد تسجيل الدخول.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">ترويسة الطلب:</p>
                <div className="flex items-center gap-2 p-3 rounded bg-white border border-slate-200 font-mono text-sm">
                  <code className="flex-1 break-all text-slate-800">Authorization: Bearer YOUR_API_KEY</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY", "auth")}
                  >
                    {copied === "auth" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  في Postman: اختر نوع المصادقة &quot;Bearer Token&quot; وأدخل مفتاح API.
                </p>
              </div>
            </section>

            {/* Base URL */}
            <section id="base-url" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                العنوان الأساسي (Base URL)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                استخدم هذا العنوان كأساس لجميع الطلبات.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900 text-teal-400 font-mono text-sm">
                <code className="flex-1 break-all">{BASE_URL}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-slate-400 hover:text-white h-8 w-8"
                  onClick={() => copyToClipboard(BASE_URL, "base")}
                >
                  {copied === "base" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </section>

            {/* Request/Response format */}
            <section id="request-response" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3">صيغة الطلب والاستجابة</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                جميع الطلبات والاستجابات تستخدم JSON. يجب إرسال الترويسة <code className="bg-slate-100 px-1 rounded text-sm">Content-Type: application/json</code> في الطلبات التي تحتوي على جسم (Body). التواريخ تُرجَع بصيغة ISO 8601 (مثل <code className="bg-slate-100 px-1 rounded text-sm">2024-01-15T10:30:00Z</code>). الترميز المدعوم هو UTF-8.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-800 mb-2">ملخص:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Request: <code className="bg-white px-1 rounded">Content-Type: application/json</code></li>
                  <li>Response: JSON مع ترويسة <code className="bg-white px-1 rounded">Content-Type: application/json</code></li>
                  <li>التواريخ: ISO 8601 (UTC)</li>
                  <li>اللغة: يمكن طلب رسائل بالعربية أو الفرنسية أو الإنجليزية عبر معامل <code className="bg-white px-1 rounded">locale</code> حيث ينطبق.</li>
                </ul>
              </div>
            </section>

            {/* Endpoints */}
            {(Object.keys(ENDPOINTS) as (keyof typeof ENDPOINTS)[]).map(
              (key) => (
                <EndpointDetails
                  key={key}
                  id={key}
                  endpoint={ENDPOINTS[key]}
                  baseUrl={BASE_URL}
                  copied={copied}
                  onCopy={copyToClipboard}
                />
              )
            )}

            {/* Schemas */}
            <section id="schemas" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                الأنواع والقيم (Schemas)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                قيم شائعة تُرجَع من نقاط النهاية أو يُتوقَّع إرسالها:
              </p>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">trust_score</h3>
                  <p className="text-slate-600 text-sm mb-2">رقم بين 0 و 1. كلما اقترب من 1 زادت الثقة.</p>
                  <ul className="text-sm text-slate-500 space-y-1">
                    <li>0.8 – 1.0: ثقة عالية</li>
                    <li>0.5 – 0.8: ثقة متوسطة</li>
                    <li>0 – 0.5: ثقة منخفضة أو مخاطر أعلى</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">risk_level</h3>
                  <p className="text-slate-600 text-sm mb-2">مستوى المخاطر: <code className="bg-slate-100 px-1 rounded">low</code> | <code className="bg-slate-100 px-1 rounded">medium</code> | <code className="bg-slate-100 px-1 rounded">high</code></p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">recommendation</h3>
                  <p className="text-slate-600 text-sm mb-2">التوصية للطلب: <code className="bg-slate-100 px-1 rounded">ship</code> (شحن) | <code className="bg-slate-100 px-1 rounded">verify</code> (طلب تحقق إضافي) | <code className="bg-slate-100 px-1 rounded">hold</code> (احتفاظ/مراجعة)</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">phone</h3>
                  <p className="text-slate-600 text-sm">رقم الهاتف بصيغة E.164، مثلاً <code className="bg-slate-100 px-1 rounded">+216XXXXXXXX</code> لتونس.</p>
                </div>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3">حدود الطلبات (Rate Limits)</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                لتجنب الإساءة، الـ API يطبّق حدود طلبات حسب الخطة. عند التجاوز يُرجَع رمز <code className="bg-slate-100 px-1 rounded text-sm">429 Too Many Requests</code> مع ترويسة <code className="bg-slate-100 px-1 rounded text-sm">Retry-After</code> (بالثواني).
              </p>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-right py-3 px-4 font-semibold text-slate-800">الخطة</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-800">الحد (تقريبي)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100"><td className="py-2 px-4 text-slate-700">مجاني / تجريبي</td><td className="py-2 px-4 text-slate-600">100 طلب/ساعة</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-4 text-slate-700">أساسي</td><td className="py-2 px-4 text-slate-600">500 طلب/ساعة</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-4 text-slate-700">احترافي</td><td className="py-2 px-4 text-slate-600">2000 طلب/ساعة</td></tr>
                    <tr><td className="py-2 px-4 text-slate-700">مؤسساتي</td><td className="py-2 px-4 text-slate-600">حسب العقد</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-sm mt-3">الترويسات الاختيارية: <code className="bg-slate-100 px-1 rounded">X-RateLimit-Limit</code>, <code className="bg-slate-100 px-1 rounded">X-RateLimit-Remaining</code> قد تُضاف في الاستجابة.</p>
            </section>

            {/* Errors */}
            <section id="errors" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                أكواد الأخطاء (Response Errors)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                عند حدوث خطأ يُرجَع رمز حالة HTTP المناسب وجسم الاستجابة قد يتضمن تفاصيل إضافية (مثل رسالة
                الخطأ).
              </p>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-right py-3 px-4 font-semibold text-slate-800">الرمز</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-800">المعنى</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ERROR_CODES.map((row) => (
                      <tr key={row.code} className="border-b border-slate-100">
                        <td className="py-2 px-4 font-mono text-slate-700">{row.code}</td>
                        <td className="py-2 px-4 text-slate-600">{row.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Use Cases */}
            <section id="use-cases" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                حالات الاستخدام
              </h2>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong className="text-slate-800">قبل الشحن:</strong> استدعِ <code className="bg-slate-100 px-1 rounded text-sm">POST /orders/score</code> عند إنشاء الطلب أو قبل تأكيد الشحن. إذا كانت <code className="bg-slate-100 px-1 rounded text-sm">recommendation = verify</code> اعرض للمشتري خطوة التحقق من الهاتف (OTP) ثم أعد التقييم.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong className="text-slate-800">تقليل الارتجاعات:</strong> ربط الطلبات برقم هاتف مُتحقَّق منه ودرجة ثقة يقلل الطلبات الوهمية والارتجاعات. استخدم النتائج في لوحة التقارير أو قواعد العمل (مثلاً شحن سريع للثقة العالية فقط).
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong className="text-slate-800">تكامل مع Shopify / WooCommerce:</strong> استخدم إضافاتنا أو الـ API مباشرة من ويب هوكس أو سكربتات الطلب. نفس النقاط (تحقق، درجة ثقة) متاحة من لوحة المتجر أو من خادمك.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong className="text-slate-800">تقارير وتحليلات:</strong> استدعِ <code className="bg-slate-100 px-1 rounded text-sm">GET /orders/:orderId</code> أو خزّن النتائج محلياً لتحليل معدلات التحقق والثقة حسب المنطقة أو الفترة.
                  </div>
                </li>
              </ul>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3">أفضل الممارسات</h2>
              <ul className="space-y-3 text-slate-600 list-disc list-inside">
                <li><strong className="text-slate-800">عدم تخزين مفتاح API في الواجهة الأمامية:</strong> استخدم دائماً خادمك (Backend) لاستدعاء الـ API وإرجاع النتائج للواجهة، حتى لا يُكشف المفتاح.</li>
                <li><strong className="text-slate-800">إعادة المحاولة عند 429 أو 5xx:</strong> نفّذ إعادة محاولة مع تأخير (backoff)، واحترم ترويسة <code className="bg-slate-100 px-1 rounded text-sm">Retry-After</code> عند وجودها.</li>
                <li><strong className="text-slate-800">تخزين مؤقت للنتائج (اختياري):</strong> يمكنك تخزين نتيجة <code className="bg-slate-100 px-1 rounded text-sm">/orders/score</code> لفترة قصيرة (مثلاً دقائق) لنفس <code className="bg-slate-100 px-1 rounded text-sm">order_id</code> لتقليل الطلبات، مع مراعاة حدّ الطلبات وسياسة الخدمة.</li>
                <li><strong className="text-slate-800">معرف الطلب الفريد:</strong> استخدم <code className="bg-slate-100 px-1 rounded text-sm">order_id</code> فريداً من نظامك لربط الطلبات بالتقارير واستعلام الحالة لاحقاً.</li>
                <li><strong className="text-slate-800">معالجة الأخطاء في الواجهة:</strong> اعرض رسائل واضحة للمستخدم عند فشل التحقق (مثلاً انتهاء صلاحية OTP أو خطأ شبكة) وامنح إمكانية إعادة المحاولة.</li>
              </ul>
            </section>

            {/* Code Examples */}
            <section id="code-examples" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3">أمثلة كود</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                أمثلة جاهزة لاستدعاء نقطة <code className="bg-slate-100 px-1 rounded text-sm">POST /orders/score</code> باستخدام cURL و JavaScript (fetch).
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">cURL</h3>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-slate-900 text-slate-300 text-sm overflow-x-auto font-mono">{`curl -X POST ${BASE_URL}/orders/score \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "phone": "+21612345678",
    "order_id": "ORD-001",
    "amount": 99.5,
    "currency": "TND"
  }'`}</pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 h-8 w-8 text-slate-400 hover:text-white"
                      onClick={() => copyToClipboard(`curl -X POST ${BASE_URL}/orders/score \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"phone": "+21612345678", "order_id": "ORD-001", "amount": 99.5, "currency": "TND"}'`, "curl")}
                    >
                      {copied === "curl" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">JavaScript (fetch)</h3>
                  <pre className="p-4 rounded-lg bg-slate-900 text-slate-300 text-sm overflow-x-auto font-mono">{`const res = await fetch('${BASE_URL}/orders/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    phone: '+21612345678',
    order_id: 'ORD-001',
    amount: 99.5,
    currency: 'TND'
  })
});
const data = await res.json();
console.log(data.trust_score, data.recommendation);`}</pre>
                </div>
              </div>
            </section>

            {/* Postman */}
            <section id="postman" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                استخدام API مع Postman
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                يمكنك استيراد مجموعة الطلبات (Collection) إلى Postman لتجربة جميع النقاط دون كتابة كود. اتبع
                الخطوات التالية:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-4">
                <li>افتح Postman على جهازك.</li>
                <li>اضغط <strong className="text-slate-800">Import</strong> ثم اختر رابط أو ملف.</li>
                <li>الصق رابط مجموعة Tunisia Trust Engine أو حمّل ملف الـ Collection (عند توفره).</li>
                <li>في المتغيرات (Variables) ضع <code className="bg-slate-100 px-1 rounded text-sm">base_url</code> و{" "}
                  <code className="bg-slate-100 px-1 rounded text-sm">api_key</code> ثم احفظ.</li>
                <li>جرّب أي طلب من المجموعة بعد تعيين مفتاح API في Authorization → Bearer Token.</li>
              </ol>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500 mb-2">رابط مجموعة Postman (Collection):</p>
                <code className="text-teal-600 text-sm break-all">https://api.tte.tn/postman/collection.json</code>
              </div>
              <Button
                className="mt-4 bg-slate-900 hover:bg-slate-800 rounded-lg"
                onClick={() => setLocation("/register")}
              >
                الحصول على مفتاح API
              </Button>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                الأسئلة الشائعة
              </h2>
              <ul className="space-y-4 text-slate-600">
                <li className="rounded-lg border border-slate-200 p-4">
                  <strong className="text-slate-800 block mb-1">أين أجد مفتاح API؟</strong>
                  بعد تسجيل الدخول، من لوحة التحكم → الإعدادات → API. يمكنك إنشاء مفتاح جديد أو استخدام المفتاح الحالي.
                </li>
                <li className="rounded-lg border border-slate-200 p-4">
                  <strong className="text-slate-800 block mb-1">هل يمكن استدعاء الـ API من المتصفح (Frontend)؟</strong>
                  لا يُنصح بذلك لأسباب أمنية. استخدم دائماً خادمك (Backend) لاستدعاء الـ API وإرجاع النتائج للواجهة.
                </li>
                <li className="rounded-lg border border-slate-200 p-4">
                  <strong className="text-slate-800 block mb-1">ما الفرق بين trust_score و risk_level؟</strong>
                  <code className="bg-slate-100 px-1 rounded text-sm">trust_score</code> رقم بين 0 و 1 يعكس مستوى الثقة. <code className="bg-slate-100 px-1 rounded text-sm">risk_level</code> تصنيف نصي (low/medium/high) للمخاطر. كلاهما مكمّل للآخر.
                </li>
                <li className="rounded-lg border border-slate-200 p-4">
                  <strong className="text-slate-800 block mb-1">هل يوجد ويب هوكس (Webhooks)؟</strong>
                  حالياً لا. يمكن إضافة إشعارات ويب هوكس لاحقاً (مثلاً عند تحديث حالة التحقق). تابع التحديثات في سجل التغييرات.
                </li>
                <li className="rounded-lg border border-slate-200 p-4">
                  <strong className="text-slate-800 block mb-1">هل الـ API يدعم لغات أخرى غير العربية؟</strong>
                  نعم. يمكنك إرسال <code className="bg-slate-100 px-1 rounded text-sm">locale</code> بقيم مثل <code className="bg-slate-100 px-1 rounded text-sm">ar</code>, <code className="bg-slate-100 px-1 rounded text-sm">fr</code>, <code className="bg-slate-100 px-1 rounded text-sm">en</code> في نقاط التحقق (OTP) للحصول على رسائل باللغة المطلوبة.
                </li>
              </ul>
            </section>

            {/* Changelog */}
            <section id="changelog" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                سجل التغييرات
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                أبرز التحديثات على مرجع الـ API:
              </p>
              <ul className="space-y-3 text-slate-600 border-r-2 border-slate-200 pr-4">
                <li>
                  <strong className="text-slate-800">v1.0.0 (2024):</strong> إطلاق أول نسخة: التحقق من الهاتف (OTP)، حساب درجة الثقة للطلب، استعلام الطلب. المصادقة بمفتاح API، حدود الطلبات، وأكواد الأخطاء.
                </li>
                <li>
                  <strong className="text-slate-800">قادم:</strong> ويب هوكس، توسيع نقاط النهاية (مثلاً قائمة الطلبات، تصدير تقارير)، وتحسينات على صيغ الاستجابة.
                </li>
              </ul>
            </section>

            <div className="pt-8 border-t border-slate-200">
              <Button variant="outline" className="rounded-lg" onClick={() => setLocation("/plugins")}>
                <ChevronLeft className="w-4 h-4 ml-2" />
                العودة إلى الإضافات
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
