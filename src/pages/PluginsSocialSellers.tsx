import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  Zap,
  Sheet,
  Bot,
  Link2,
  Monitor,
  Plug,
  Sparkles,
} from "lucide-react";
import { fadeInUp } from "./home/components/animations";
import { cn } from "@/lib/utils";

const SOLUTIONS = [
  {
    id: "meta-commerce",
    title: "متاجر فيسبوك وإنستغرام",
    subtitle: "Facebook Shops & Instagram Shopping",
    summary: "ويب هوك من Meta عند كل طلب → إنشاء تلقائي في TTE.",
    target: "بياعون يستخدمون متاجر فيسبوك أو إنستغرام مع الدفع.",
    how: "TTE يعرض ويب هوك تستدعيه Meta عند إنشاء أو تحديث الطلب. نستخرج الهاتف والمبلغ والحالة وننشئ الطلب/التقرير تلقائياً.",
    result: "تلقائي بالكامل. بدون إدخال يدوي.",
    limitations: "فقط لمن يستخدم Shops/Checkout. بياعو الدردشة فقط لا يحصلون على ويب هوكات.",
    icon: ShoppingBag,
    gradient: "from-blue-600 to-indigo-700",
    automation: "تلقائي كامل",
  },
  {
    id: "whatsapp-messaging",
    title: "واتساب وإنستغرام للرسائل",
    subtitle: "WhatsApp Business API & Instagram Messaging",
    summary: "أحداث «طلب مؤكد» من الأداة → استدعاء API TTE.",
    target: "بياعون يستخدمون واتساب للأعمال أو أدوات مثل ManyChat، Respond.io.",
    how: "إضافة تشترك في أحداث الطلب. نستخرج الهاتف والمبلغ ونستدعي API TTE.",
    result: "تلقائي لكل طلب تعرضه الأداة عبر API.",
    limitations: "يتطلب Business API أو منصة تدعم ويب هوكات.",
    icon: MessageCircle,
    gradient: "from-green-600 to-emerald-700",
    automation: "تلقائي كامل",
  },
  {
    id: "zapier-make",
    title: "Zapier / Make",
    subtitle: "TTE Integration",
    summary: "لصقة في جدول أو نموذج → TTE ينشئ الطلب/التقرير.",
    target: "أي بائع يوافق على لصق الطلبات في Google Sheet، Airtable، Typeform.",
    how: "API بمفتاح. المستخدم يبني سيناريو: صف جديد أو إجابة نموذج → TTE ينشئ الطلب.",
    result: "لصقة واحدة بدل فتح لوحة TTE.",
    limitations: "خطوة يدوية واحدة (لصق في الجدول/النموذج).",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    automation: "لصقة واحدة",
  },
  {
    id: "sheet-airtable",
    title: "قالب Google Sheet / Airtable",
    subtitle: "Template Plugin",
    summary: "صف جديد في القالب → سكربت يستدعي API TTE.",
    target: "بياعون مرتاحون لاستخدام جدول أو قاعدة واحدة.",
    how: "قالب بأعمدة (اسم، هاتف، مبلغ، تاريخ، حالة). سكربت عند صف جديد يستدعي API TTE.",
    result: "البائع يلصق من الدردشة؛ الإنشاء في TTE تلقائي.",
    limitations: "نسخ القالب وإضافة مفتاح API مرة واحدة.",
    icon: Sheet,
    gradient: "from-green-500 to-teal-600",
    automation: "لصقة واحدة",
  },
  {
    id: "telegram-whatsapp-bot",
    title: "بوت تيليجرام أو واتساب",
    subtitle: "Semi-automatic",
    summary: "رسالة واحدة مثل: order 21612345678 150 → البوت ينشئ في TTE.",
    target: "بياعون يفضلون الموبايل وإجراءات سريعة.",
    how: "بوت يفسر الرسالة ويستدعي API TTE (التاجر مرتبط بمعرف أو مفتاح API).",
    result: "رسالة واحدة من الهاتف. احتكاك منخفض.",
    limitations: "رسالة لكل طلب/تقرير؛ صيغة بسيطة موثقة.",
    icon: Bot,
    gradient: "from-sky-500 to-blue-600",
    automation: "رسالة واحدة",
  },
  {
    id: "link-in-bio",
    title: "رابط في البايو / نموذج مسبوق",
    subtitle: "Link in Bio / Prefilled Form",
    summary: "نموذج خفيف أو رابط مسبوق (?phone=...&amount=...) → إرسال بنقرة.",
    target: "بياعون يريدون رابطاً واحداً يفتحونه من الدردشة.",
    how: "نموذج: هاتف، مبلغ، نوع التقرير. اختياري: معلمات في الرابط للتعبئة المسبقة.",
    result: "نقرة من الرابط بدل فتح لوحة التحكم.",
    limitations: "إجراء يدوي واحد (فتح الرابط وإرسال).",
    icon: Link2,
    gradient: "from-violet-500 to-purple-600",
    automation: "نقرة واحدة",
  },
  {
    id: "browser-extension",
    title: "إضافة متصفح",
    subtitle: "Add to TTE from Facebook/Instagram",
    summary: "نقرة «أضف إلى TTE» في المحادثة → الإضافة ترسل البيانات إلى TTE.",
    target: "بياعون يديرون الطلبات من سطح المكتب.",
    how: "إضافة تقرأ النص الظاهر (اسم، هاتف، مبلغ) وتستدعي API TTE بمفتاح مخزّن.",
    result: "نقرة واحدة من نافذة الدردشة.",
    limitations: "واجهة Meta قد تتغير؛ اعتبارات ToS وخصوصية.",
    icon: Monitor,
    gradient: "from-slate-600 to-slate-800",
    automation: "نقرة واحدة",
  },
  {
    id: "third-party-dm",
    title: "أدوات طرف ثالث (DM → طلب)",
    subtitle: "Third-Party DM to Order",
    summary: "أداة تصدّر أحداث الطلب → إضافة TTE تشترك وتُنشئ في TTE.",
    target: "بياعون يستخدمون منتج دردشة-تجارة يدعم ويب هوكات أو API.",
    how: "المنتج يصدّر «طلب أنشئ» و«مرتجع». إضافة TTE تشترك وتُحوّل إلى طلب/تقرير.",
    result: "تلقائي بعد ربط التكامل.",
    limitations: "يعتمد على توفر الأدوات في السوق وجودة API.",
    icon: Plug,
    gradient: "from-neutral-600 to-neutral-800",
    automation: "تلقائي كامل",
  },
];

const PRIORITY = [
  "API إنشاء طلب وتقرير بمفتاح API",
  "Zapier/Make + قالب Sheet (لصقة واحدة)",
  "بوت تيليجرام أو واتساب",
  "ويب هوكات Meta Commerce / Messaging",
];

export default function PluginsSocialSellers() {
  const [, setLocation] = useLocation();
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen w-full bg-slate-50/50 text-slate-900" dir="rtl">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col justify-center py-24 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_0%,rgba(20,184,166,0.06)_50%,transparent_100%)]" aria-hidden />
        <div className="absolute inset-0 opacity-[0.07] bg-[length:48px_48px] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[position:0_0]" style={{ backgroundSize: "48px 48px" }} />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-10"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-teal-300 text-sm font-medium mb-5 border border-white/5">
                <MessageCircle className="w-4 h-4" />
                بياعو فيسبوك وإنستغرام
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                حلول لبياعين بدون موقع
              </h1>
              <p className="text-slate-300 text-lg md:text-xl mb-8 leading-relaxed">
                تبيع عبر الدردشة؟ أفكار تكامل لجعل الطلبات والتقارير تلقائية أو بأقل جهد.
              </p>
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl px-6 w-fit shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/40 hover:-translate-y-0.5"
                onClick={() => setLocation("/plugins")}
              >
                كل الإضافات
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions-list" className="py-16 md:py-24 scroll-mt-20 w-full bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-10 text-center md:text-right"
          >
            <span className="inline-block w-10 h-0.5 bg-teal-500 rounded-full mb-4" aria-hidden />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">الحلول المقترحة</h2>
            <p className="text-slate-600 text-base">انقر على أي حل لمعرفة التفاصيل.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full"
          >
            <Accordion
              type="single"
              collapsible
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className="w-full space-y-3"
            >
              {SOLUTIONS.map((sol) => (
                <AccordionItem
                  key={sol.id}
                  value={sol.id}
                  className={cn(
                    "border-0 rounded-2xl bg-white shadow-md shadow-slate-200/50 overflow-hidden transition-all duration-200",
                    openAccordion === sol.id && "ring-2 ring-teal-500/20 shadow-lg shadow-teal-500/5"
                  )}
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50/60 [&>svg]:shrink-0 md:px-6 md:py-5 transition-colors rounded-2xl data-[state=open]:bg-slate-50/80 data-[state=open]:rounded-b-none">
                    <div className="flex items-center gap-3 md:gap-4 text-right flex-1 w-full">
                      <div
                        className={cn(
                          "w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-inner",
                          sol.gradient
                        )}
                      >
                        <sol.icon className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-base md:text-lg">{sol.title}</p>
                        <p className="text-xs md:text-sm text-slate-500 truncate mt-0.5">{sol.summary}</p>
                      </div>
                      <Badge variant="secondary" className="bg-teal-50 text-teal-700 border border-teal-200/60 text-xs shrink-0 font-medium">
                        {sol.automation}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-0 md:px-6 md:pb-6 bg-slate-50/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm text-slate-600 border-r-2 border-teal-200 pr-4 max-w-4xl">
                      <p><span className="font-semibold text-slate-700">لمن:</span> {sol.target}</p>
                      <p><span className="font-semibold text-slate-700">كيف:</span> {sol.how}</p>
                      <p><span className="font-semibold text-slate-700">النتيجة:</span> {sol.result}</p>
                      <p className="text-slate-500 md:col-span-2"><span className="font-semibold text-slate-600">القيود:</span> {sol.limitations}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Next steps */}
      <section className="py-16 md:py-24 bg-slate-50 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full"
          >
            <Card className="w-full border-0 bg-white shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 pt-6 px-6 md:px-8">
                <CardTitle className="text-lg md:text-xl flex items-center gap-2 text-slate-900">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-600">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  الخطوات القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-8 md:px-8">
                <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 list-none">
                  {PRIORITY.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-slate-600 text-sm md:text-base transition-colors hover:bg-slate-100/80 hover:border-slate-200"
                    >
                      <span className="flex shrink-0 w-7 h-7 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-28 bg-slate-900 w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.08)_0%,transparent_50%)]" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 text-center md:text-right">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                تبيع على فيسبوك أو إنستغرام؟
              </h2>
              <p className="text-slate-300 text-base md:text-lg max-w-xl">
                سجّل واحصل على مفتاح API أو انتظر الإضافات الجاهزة.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 shrink-0">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl px-6 md:px-8 shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/40 hover:-translate-y-0.5"
                onClick={() => setLocation("/register")}
              >
                إنشاء حساب مجاني
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-500 text-white hover:bg-slate-800 hover:border-slate-400 rounded-xl px-6 md:px-8 transition-all"
                onClick={() => setLocation("/plugins")}
              >
                كل الإضافات
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
