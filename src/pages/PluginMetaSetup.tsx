import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plug,
  Facebook,
  Instagram,
  CheckCircle2,
  AlertCircle,
  Shield,
  ExternalLink,
  Server,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeUp, stagger, scaleIn } from "./home/components/animations";

const STEPS = [
  "تأكد من ربط حساب إنستغرام المهني بنفس صفحة فيسبوك",
  "صلاحية المسؤول على الصفحة مطلوبة",
  "اربط الصفحة مع يقين عبر Meta Console",
  "تأكد من أن الخدمة تعمل على HTTPS في الإنتاج",
];

const REQUIREMENTS = [
  "معرفة تقنية أو مطور",
  "HTTPS في الإنتاج",
  "صلاحية المسؤول على صفحة فيسبوك",
];

export default function PluginMetaSetup() {
  const [, setLocation] = useLocation();
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Navigation />

      <section className="relative pt-16 md:pt-20 py-10 md:py-12 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)]" style={{ backgroundSize: "48px 48px" }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(20,184,166,0.06)_50%,transparent_100%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-teal-300 text-sm font-medium border border-primary-foreground/5">
                <Plug className="w-4 h-4" />
                إعداد يدوي عبر Meta
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-500/30">
                <Facebook className="w-3.5 h-3.5" />
                Messenger
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-pink-200 text-xs font-semibold border border-pink-500/30">
                <Instagram className="w-3.5 h-3.5" />
                Instagram DM
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-black text-primary-foreground mb-2 leading-tight">
              ربط يدوي عبر Meta Console
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-300 text-sm md:text-base mb-6 max-w-xl mx-auto">
              ربط مباشر بين فيسبوك ومنصة يقين — للمطورين أو بمساعدة تقنية.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-8">
              <Button
                size="sm"
                className="bg-teal-500 hover:bg-teal-400 dark:bg-teal-600 dark:hover:bg-teal-500 text-slate-900 font-bold rounded-xl px-5 shadow-lg shadow-teal-500/25"
                onClick={() => setLocation("/api-docs")}
              >
                <ArrowLeft className="w-4 h-4 me-2 rtl:rotate-180" />
                توثيق API
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 dark:hover:bg-primary-foreground/20 rounded-xl px-5"
                onClick={() => setLocation("/plugins/social-sellers")}
              >
                العودة
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-primary-foreground/10 pt-8"
          >
            {[
              { value: "يدوي", label: "إعداد" },
              { value: "HTTPS", label: "مطلوب" },
              { value: "Meta", label: "Console" },
              { value: "مطور", label: "مساعدة فنية" },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={scaleIn} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-primary-foreground mb-0.5">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">خطوات الإعداد</h2>
            <p className="text-muted-foreground">تأكد من المتطلبات قبل البدء</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-4 gap-4"
          >
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="relative bg-card/40 backdrop-blur-sm rounded-2xl p-5 border border-border/50 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Server className="w-6 h-6 text-accent" />
                </div>
                <span className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{step}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">التفاصيل</h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.div variants={scaleIn} className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                لمن هذه الطريقة؟
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                للمستخدمين الذين لديهم معرفة فنية أو يفضلون الاستعانة بمطور. الإعداد يتم عبر
                Meta Console مباشرة.
              </p>
            </motion.div>
            <motion.div variants={scaleIn} className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                كيف يتم الربط؟
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                يتم التأكد من ربط الحساب وصفحة فيسبوك بشكل صحيح مع يقين عبر Meta Console.
                بعد الربط، تصل الرسائل مباشرة إلى يقين ويتم تسجيل الطلبات بشكل منتظم.
              </p>
            </motion.div>
            <motion.div variants={scaleIn} className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                متطلبات تقنية
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                يتطلب الخدمة عنوان HTTPS في الإنتاج. تأكد من تهيئة الخادم بشهادة SSL صالحة
                قبل بدء الربط.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 text-center"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">ما تحتاجه للبدء</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {REQUIREMENTS.map((req, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {req}
                </div>
              ))}
            </div>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl px-6 shadow-lg shadow-accent/20"
              onClick={() => setLocation("/api-docs")}
            >
              <ExternalLink className="w-4 h-4 ms-2" />
              عرض التعليمات الفنية
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="relative py-14 md:py-20 overflow-hidden bg-gradient-to-br from-primary to-primary/90">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              تحتاج مساعدة؟
            </motion.h2>
            <motion.p variants={fadeUp} className="text-primary-foreground/80 mb-8">
              راجع توثيق API أو تواصل مع فريق الدعم الفني.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl px-8 shadow-lg shadow-accent/20"
                onClick={() => setLocation("/api-docs")}
              >
                توثيق API
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-xl px-8"
                onClick={() => setLocation("/plugins/social-sellers")}
              >
                العودة للإضافات
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
