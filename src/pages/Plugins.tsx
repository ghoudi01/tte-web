import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plug,
  Zap,
  Shield,
  ArrowLeft,
  Store,
  ShoppingBag,
  Code2,
  Sparkles,
  Lock,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "./home/components/animations";
import { trpc } from "@/lib/trpc";
import { PluginCard } from "./plugins/components/PluginCard";

/** Plugin documentation URLs - Shopify & WooCommerce open external docs, API opens /api-docs, social sellers is internal page */
const PLUGIN_DOCS = {
  shopify: "https://docs.tte.tn/plugins/shopify",
  woocommerce: "https://docs.tte.tn/plugins/woocommerce",
  api: "/api-docs",
  socialSellers: "/plugins/social-sellers",
} as const;

const PLUGINS = [
  {
    id: "shopify",
    name: "Shopify",
    nameAr: "تكامل Shopify",
    description: "ربط تلقائي مع متجرك على Shopify. تحقق من كل طلب قبل الشحن وحساب درجة الثقة والمخاطر في الوقت الفعلي.",
    features: [
      "تحقق تلقائي من رقم الهاتف عند الطلب",
      "درجة ثقة ومخاطر لكل طلب",
      "لوحة تحكم مدمجة في Shopify",
      "دعم كامل للعملة التونسية",
    ],
    icon: Store,
    gradient: "from-green-600 to-emerald-700",
    badge: "الأكثر طلباً",
    version: "1.2.0",
    docsUrl: PLUGIN_DOCS.shopify,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    nameAr: "تكامل WooCommerce",
    description: "إضافة جاهزة لمتاجر ووردبريس. تقليل الارتجاعات والاحتيال مع تقارير مفصلة عن سلوك المشترين.",
    features: [
      "تحقق من الطلبات قبل المعالجة",
      "تقييم مخاطر مخصص",
      "تكامل مع صفحة الطلب",
      "تقارير وتصدير Excel",
    ],
    icon: ShoppingBag,
    gradient: "from-purple-600 to-violet-700",
    badge: "للمتاجر التونسية",
    version: "1.1.5",
    docsUrl: PLUGIN_DOCS.woocommerce,
  },
  {
    id: "api",
    name: "API",
    nameAr: "تكامل API",
    description: "ربط أي منصة أو تطبيق عبر API. مرن وقوي للتجار والمطورين والأنظمة الداخلية.",
    features: [
      "REST API موثق بالكامل",
      "مفتاح API وآمان متقدم",
      "ويب هوكس للتحديثات الفورية",
      "أمثلة كود جاهزة",
    ],
    icon: Code2,
    gradient: "from-slate-700 to-slate-900",
    badge: "للمطورين",
    version: "2.0.0",
    docsUrl: PLUGIN_DOCS.api,
  },
  {
    id: "socialSellers",
    name: "Facebook & Instagram",
    nameAr: "حلول فيسبوك وإنستغرام",
    description: "بياعون بدون موقع؟ تكاملات وأفكار لجعل الطلبات والتقارير تلقائية أو باحتكاك منخفض—مثل WooCommerce للدردشة.",
    features: [
      "متاجر Meta، واتساب، Zapier، أوراق جوجل",
      "بوت تيليجرام/واتساب، رابط في البايو",
      "إضافة متصفح، أدوات طرف ثالث",
      "جدول ملخص وأولويات مقترحة",
    ],
    icon: MessageCircle,
    gradient: "from-blue-600 to-indigo-700",
    badge: "بدون موقع",
    version: "—",
    docsUrl: PLUGIN_DOCS.socialSellers,
  },
];

const WHY_ITEMS = [
  {
    icon: Shield,
    title: "تقليل الارتجاعات",
    description: "تحقق من المشترين قبل الشحن وقلل معدل الارتجاع بنسبة تصل إلى 40%.",
  },
  {
    icon: Zap,
    title: "تفعيل خلال دقائق",
    description: "إعداد بسيط بدون برمجة. اربط متجرك وابدأ التحقق في نفس اليوم.",
  },
  {
    icon: BarChart3,
    title: "تقارير وتنبؤات",
    description: "لوحة تحكم واضحة مع درجات الثقة والمخاطر وتقارير قابلة للتصدير.",
  },
  {
    icon: Lock,
    title: "آمن وموثوق",
    description: "بياناتك محمية. نلتزم بأعلى معايير الأمان والخصوصية في تونس.",
  },
];

const STEPS = [
  { step: 1, title: "سجّل واحصل على مفتاح API", desc: "أنشئ حساباً مجانياً واحصل على مفتاح التكامل فوراً." },
  { step: 2, title: "ثبّت الإضافة أو اربط API", desc: "اختر إضافة متجرك أو استخدم API للتكامل المخصص." },
  { step: 3, title: "فعّل التحقق واتبع النتائج", desc: "التحقق يعمل تلقائياً. تتبع الدرجات والتقارير من لوحة التحكم." },
];

const COMING_SOON = [
  { name: "Magento", nameAr: "Magento", desc: "تكامل كامل مع منصة Magento" },
  { name: "PrestaShop", nameAr: "PrestaShop", desc: "دعم متاجر PrestaShop التونسية" },
  { name: "تطبيق موبايل", nameAr: "تطبيق موبايل", desc: "تحقق سريع من الهاتف" },
];

export default function Plugins() {
  const [, setLocation] = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.plugins;
  const openPluginDocs = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
      return;
    }
    setLocation(url);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      <Navigation />

      {/* Hero - full viewport */}
      <section className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-teal-300 text-sm font-medium mb-6">
              <Plug className="w-4 h-4" />
              إضافات وتكاملات جاهزة
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              {c?.pageTitle ?? "الإضافات"}
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              {c?.pageSubtitle ?? "تثبيت وإدارة الإضافات والتكاملات"}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl px-6 shadow-lg"
                onClick={() => setLocation("/register")}
              >
                ابدأ مجاناً
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 rounded-xl px-6"
                onClick={() => document.getElementById("plugins-catalog")?.scrollIntoView({ behavior: "smooth" })}
              >
                تصفح الإضافات
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why integrate */}
      <section className="py-16 md:py-24 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">لماذا Tunisia Trust Engine؟</h2>
            <p className="text-lg text-slate-600">تكامل سريع، نتائج واضحة، ودعم محلي.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {WHY_ITEMS.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center mb-3">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-900">{item.title}</CardTitle>
                    <CardDescription className="text-slate-600">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Plugin catalog */}
      <section id="plugins-catalog" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">اختر إضافة متجرك</h2>
            <p className="text-lg text-slate-600">تكاملات رسمية وموثوقة. تفعيل خلال دقائق.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {PLUGINS.map((plugin, idx) => (
              <motion.div key={plugin.id} variants={fadeInUp}>
                <PluginCard
                  plugin={plugin}
                  isHovered={hoveredId === plugin.id}
                  onHover={setHoveredId}
                  onOpen={openPluginDocs}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">كيف تبدأ؟</h2>
            <p className="text-lg text-slate-600">ثلاث خطوات بسيطة للتفعيل.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="relative grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {/* Connector line behind step numbers */}
            <div
              className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-slate-200 z-0"
              aria-hidden
            />
            {STEPS.map((s, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">قريباً</h2>
            <p className="text-lg text-slate-600">تكاملات ومنتجات جديدة قيد الإعداد.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4"
          >
            {COMING_SOON.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50/50"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{item.nameAr}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">جاهز للبدء؟</h2>
            <p className="text-slate-300 mb-8 text-lg">
              أنشئ حسابك مجاناً، اختر الإضافة المناسبة لمتجرك، وابدأ التحقق من المشترين اليوم.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl px-8"
                onClick={() => setLocation("/register")}
              >
                إنشاء حساب مجاني
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-500 text-white hover:bg-slate-800 rounded-xl px-8"
                onClick={() => setLocation("/")}
              >
                العودة للرئيسية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
