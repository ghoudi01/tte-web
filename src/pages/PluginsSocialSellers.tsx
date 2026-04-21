import { useLocation } from "wouter";
import { useState } from "react";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  CheckCircle2,
  ChevronDown,
  Globe,
  Lightbulb,
  MessageSquareText,
  Settings,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Workflow,
  Webhook,
} from "lucide-react";

const SIDEBAR_SECTIONS = [
  { id: "introduction", label: "نظرة عامة" },
  { id: "who", label: "لمن هذا الحل؟" },
  { id: "workflow", label: "آلية العمل" },
  {
    id: "decisions",
    label: "القرارات",
    children: [
      { id: "approve", label: "تأكيد مباشر" },
      { id: "confirm", label: "تأكيد إضافي" },
      { id: "deposit", label: "دفعة مقدمة" },
      { id: "call", label: "تحقق عبر مكالمة" },
    ],
  },
  { id: "integration-modes", label: "طرق الربط" },
  { id: "api", label: "بيانات نقطة الربط" },
  { id: "features", label: "ميزات متقدمة" },
  { id: "rules", label: "ضوابط الاستخدام" },
  { id: "cta", label: "البدء الآن" },
];

const DECISION_ITEMS = [
  {
    id: "approve",
    title: "تأكيد مباشر",
    key: "APPROVE",
    description: "يُستخدم عندما تكون مؤشرات الطلب قوية وواضحة.",
    customerMessage: "تم تأكيد طلبك بنجاح.",
  },
  {
    id: "confirm",
    title: "تأكيد إضافي",
    key: "CONFIRM",
    description: "يُستخدم عند الحاجة إلى تثبيت بسيط للبيانات.",
    customerMessage: "يرجى تأكيد صحة المعلومات لإكمال الطلب.",
  },
  {
    id: "deposit",
    title: "دفعة مقدمة",
    key: "REQUIRE_DEPOSIT",
    description: "يُستخدم عندما يتطلب الطلب خطوة ضمان إضافية.",
    customerMessage: "يرجى دفع مبلغ مقدم بسيط لتأكيد الطلب.",
  },
  {
    id: "call",
    title: "تحقق عبر مكالمة",
    key: "VERIFY_CALL",
    description: "يُستخدم للحالات ذات المخاطر المرتفعة.",
    customerMessage: "يرجى الرد على مكالمة التحقق لإتمام التأكيد.",
  },
];

export default function PluginsSocialSellers() {
  const [, setLocation] = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    decisions: true,
  });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900" dir="rtl">
      <Navigation />
      <div className="flex border-t border-slate-200">
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
                        {section.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollTo(child.id)}
                            className="flex items-center gap-2 w-full py-1.5 px-3 rounded text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            {child.label}
                          </button>
                        ))}
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

        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <section id="introduction" className="scroll-mt-24 mb-14">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Social Sellers
              </h1>
              <p className="text-slate-600 leading-relaxed mb-4">
                هذا الحل مخصص للبائعين عبر فيسبوك وإنستغرام الذين يعتمدون على
                المحادثات لاستقبال الطلبات. الهدف هو تنظيم القرارات قبل الشحن
                وتقليل الإرجاع مع الحفاظ على تجربة عميل جيدة.
              </p>
              <p className="text-slate-600 leading-relaxed">
                تعمل المنصة كطبقة قرار بين المحادثة وتنفيذ الطلب، بحيث تحدد
                الإجراء الأنسب لكل حالة دون تعقيد في سير العمل.
              </p>
            </section>

            <section id="who" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                لمن هذا الحل؟
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li className="rounded-lg border border-slate-200 p-4">
                  بائعون يستقبلون الطلبات مباشرة عبر الرسائل.
                </li>
                <li className="rounded-lg border border-slate-200 p-4">
                  فرق صغيرة تحتاج قرارات أسرع ووقت مراجعة أقل.
                </li>
                <li className="rounded-lg border border-slate-200 p-4">
                  متاجر تريد تقليل الإرجاع والطلبات غير الجادة.
                </li>
              </ul>
            </section>

            <section id="workflow" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                آلية العمل
              </h2>
              <div className="space-y-3 text-slate-600">
                <Card className="border-slate-200">
                  <CardContent className="pt-5">
                    <p className="font-semibold text-slate-800 mb-1">1) جمع البيانات</p>
                    <p>جمع معلومات الطلب من المحادثة: الاسم، الهاتف، العنوان، المبلغ.</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="pt-5">
                    <p className="font-semibold text-slate-800 mb-1">2) إرسال للتقييم</p>
                    <p>إرسال الطلب إلى النظام عبر نقطة الربط للحصول على قرار واضح.</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="pt-5">
                    <p className="font-semibold text-slate-800 mb-1">3) تنفيذ القرار</p>
                    <p>تحديث مسار المحادثة تلقائيًا بناءً على القرار المعاد من النظام.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="decisions" className="scroll-mt-24 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquareText className="w-5 h-5" />
                القرارات المتاحة
              </h2>
            </section>

            {DECISION_ITEMS.map((item) => (
              <section key={item.id} id={item.id} className="scroll-mt-24 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-teal-100 text-teal-800">
                    {item.key}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-3">{item.description}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-medium">رسالة مقترحة للعميل:</span>{" "}
                  {item.customerMessage}
                </div>
              </section>
            ))}

            <section id="integration-modes" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                طرق الربط
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Webhook className="w-4 h-4 text-teal-600" />
                      ربط الأنظمة الحالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 space-y-2">
                    <p>استخدام منصات المحادثة الحالية وربطها مباشرة مع النظام.</p>
                    <p>مناسب عند وجود تدفق عمل جاهز وتحتاج فقط طبقة اتخاذ القرار.</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      مساعد بداية بسيط
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600 space-y-2">
                    <p>تدفق جاهز للانطلاق السريع عند عدم وجود نظام محادثة معقد.</p>
                    <p>مناسب للبدايات السريعة مع إمكانية التوسعة لاحقًا.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section id="api" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3">بيانات نقطة الربط</h2>
              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                <p className="mb-2">
                  <span className="font-semibold">المسار:</span>{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded">POST /tte/check-order</code>
                </p>
                <p className="font-semibold mb-2">الحقول الأساسية:</p>
                <ul className="space-y-1 text-slate-600 text-sm mb-3">
                  <li>- phone</li>
                  <li>- amount</li>
                  <li>- name (اختياري)</li>
                  <li>- address (اختياري)</li>
                </ul>
                <p className="text-sm text-slate-600">
                  النتيجة تكون أحد القرارات الأربعة:{" "}
                  <code className="bg-white px-1 rounded">APPROVE</code>,{" "}
                  <code className="bg-white px-1 rounded">CONFIRM</code>,{" "}
                  <code className="bg-white px-1 rounded">REQUIRE_DEPOSIT</code>,{" "}
                  <code className="bg-white px-1 rounded">VERIFY_CALL</code>.
                </p>
              </div>
            </section>

            <section id="features" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                ميزات متقدمة
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 mt-1 shrink-0" />
                  تأهيل ذكي للطلبات عند الحاجة إلى معلومات إضافية.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-1 shrink-0" />
                  رسائل واضحة ومهنية تناسب تجربة العميل.
                </li>
                <li className="flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-teal-600 mt-1 shrink-0" />
                  تحقق هاتفي للحالات ذات المخاطر المرتفعة.
                </li>
              </ul>
            </section>

            <section id="rules" className="scroll-mt-24 mb-14">
              <h2 className="text-xl font-bold text-slate-900 mb-3">ضوابط الاستخدام</h2>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-800">عرض نتيجة التقييم</td>
                      <td className="py-3 px-4 text-slate-600">لا تُعرض درجة الثقة مباشرة للعميل.</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium text-slate-800">طريقة التعامل</td>
                      <td className="py-3 px-4 text-slate-600">اعتماد خطوات تحقق تدريجية بدل الرفض المباشر.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-slate-800">تجربة الاستخدام</td>
                      <td className="py-3 px-4 text-slate-600">واجهة واضحة وسريعة ومناسبة للهواتف.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="cta" className="scroll-mt-24 mb-6">
              <div className="rounded-xl bg-slate-900 text-white p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-2">ابدأ الآن</h2>
                <p className="text-slate-300 mb-5">
                  فعّل الصفحة خلال دقائق وابدأ تنظيم الطلبات القادمة من المحادثات.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold"
                    onClick={() => setLocation("/register")}
                  >
                    إنشاء حساب مجاني
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-500 text-white hover:bg-slate-800"
                    onClick={() => setLocation("/api-docs")}
                  >
                    توثيق الواجهة البرمجية
                  </Button>
                </div>
              </div>
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
