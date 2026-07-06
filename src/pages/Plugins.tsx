import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  CheckCircle2,
  Store,
  ShoppingBag,
  Code2,
  Rocket,
  Sparkles,
  Lock,
  BarChart3,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { fadeUp, stagger, fadeLeft, fadeRight, scaleIn } from "./home/components/animations";
import { trpc } from "@/lib/trpc";

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
    nameKey: "plugins.shopifyName",
    descKey: "plugins.shopifyDesc",
    featureKeys: ["plugins.shopifyFeature1", "plugins.shopifyFeature2", "plugins.shopifyFeature3", "plugins.shopifyFeature4"],
    icon: Store,
    gradient: "from-emerald-500 to-teal-600",
    badgeKey: "plugins.shopifyBadge",
    version: "1.2.0",
    docsUrl: PLUGIN_DOCS.shopify,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    nameKey: "plugins.wooName",
    descKey: "plugins.wooDesc",
    featureKeys: ["plugins.wooFeature1", "plugins.wooFeature2", "plugins.wooFeature3", "plugins.wooFeature4"],
    icon: ShoppingBag,
    gradient: "from-violet-500 to-purple-600",
    badgeKey: "plugins.wooBadge",
    version: "1.1.5",
    docsUrl: PLUGIN_DOCS.woocommerce,
  },
  {
    id: "api",
    name: "API",
    nameKey: "plugins.apiName",
    descKey: "plugins.apiDesc",
    featureKeys: ["plugins.apiFeature1", "plugins.apiFeature2", "plugins.apiFeature3", "plugins.apiFeature4"],
    icon: Code2,
    gradient: "from-slate-600 to-slate-800",
    badgeKey: "plugins.apiBadge",
    version: "2.0.0",
    docsUrl: PLUGIN_DOCS.api,
  },
  {
    id: "socialSellers",
    name: "Facebook & Instagram",
    nameKey: "plugins.socialName",
    descKey: "plugins.socialDesc",
    featureKeys: ["plugins.socialFeature1", "plugins.socialFeature2", "plugins.socialFeature3", "plugins.socialFeature4"],
    icon: MessageCircle,
    gradient: "from-blue-500 to-indigo-600",
    badgeKey: "plugins.socialBadge",
    version: "—",
    docsUrl: PLUGIN_DOCS.socialSellers,
  },
];

const WHY_ITEMS = [
  {
    icon: Shield,
    titleKey: "plugins.whyReduce",
    descKey: "plugins.whyReduceDesc",
  },
  {
    icon: Zap,
    titleKey: "plugins.whyFast",
    descKey: "plugins.whyFastDesc",
  },
  {
    icon: BarChart3,
    titleKey: "plugins.whyReports",
    descKey: "plugins.whyReportsDesc",
  },
  {
    icon: Lock,
    titleKey: "plugins.whySecure",
    descKey: "plugins.whySecureDesc",
  },
];

const STEPS = [
  { step: 1, titleKey: "plugins.step1Title", descKey: "plugins.step1Desc" },
  { step: 2, titleKey: "plugins.step2Title", descKey: "plugins.step2Desc" },
  { step: 3, titleKey: "plugins.step3Title", descKey: "plugins.step3Desc" },
];

const COMING_SOON = [
  { nameKey: "plugins.comingMagentoName", descKey: "plugins.comingMagentoDesc" },
  { nameKey: "plugins.comingPrestaName", descKey: "plugins.comingPrestaDesc" },
  { nameKey: "plugins.comingMobileName", descKey: "plugins.comingMobileDesc" },
];

export default function Plugins() {
  const [, setLocation] = useLocation();
  const { dir, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Navigation solid />

      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)]" style={{ backgroundSize: "48px 48px" }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(20,184,166,0.06)_50%,transparent_100%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight mb-4">
              {t("plugins.heroTitle")}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("plugins.pageSubtitle")}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl px-8 shadow-lg shadow-accent/20"
                onClick={() => setLocation("/register")}
              >
                {t("plugins.registerFree")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl px-8"
                onClick={() => {
                  const el = document.getElementById("plugins-catalog");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("plugins.browsePlugins")}
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-primary-foreground/10 pt-8 mt-12"
          >
            {[
              { value: "4", label: t("plugins.available") },
              { value: "150+", label: t("plugins.merchants") },
              { value: "99.9%", label: t("plugins.uptime") },
              { value: "5", label: t("plugins.minutes") },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-black text-primary-foreground mb-0.5">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">{t("plugins.whyTitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("plugins.whySubtitle")}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {WHY_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-4 shadow-md shadow-accent/10 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="plugins-catalog" className="py-14 md:py-20 scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-40 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-40 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">{t("plugins.chooseTitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("plugins.chooseSubtitle")}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PLUGINS.map((plugin, idx) => (
              <motion.div
                key={plugin.id}
                variants={idx === 0 ? fadeLeft : idx === 3 ? fadeRight : fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 pb-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plugin.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                      <plugin.icon className="w-7 h-7 text-white" />
                    </div>
                    {plugin.badgeKey && (
                      <span className="shrink-0 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent/20">
                        {t(plugin.badgeKey)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{t(plugin.nameKey)}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{t(plugin.descKey)}</p>
                  <p className="text-xs text-muted-foreground/60 mb-4">{t("plugins.version")} {plugin.version}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plugin.featureKeys.map((fk, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        {t(fk)}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-primary/10 hover:bg-primary/20 text-foreground rounded-xl font-semibold border border-border/50 dark:bg-primary/20 dark:hover:bg-primary/30"
                    onClick={() =>
                      plugin.docsUrl.startsWith("http")
                        ? window.open(plugin.docsUrl, "_blank")
                        : setLocation(plugin.docsUrl)
                    }
                  >
                    <Rocket className="w-4 h-4 ms-2" />
                    {plugin.id === "api" ? t("plugins.apiDocs") : plugin.id === "socialSellers" ? t("plugins.setupBot") : t("plugins.openDocs")}
                    <ExternalLink className="w-3.5 h-3.5 me-1.5 opacity-60" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-accent/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">{t("plugins.howTitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("plugins.howSubtitle")}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {STEPS.map((s, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="relative text-center bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/40 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-2xl font-black text-accent-foreground mx-auto mb-4 shadow-lg shadow-accent/10">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t(s.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(s.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">{t("plugins.comingSoonTitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("plugins.comingSoonSubtitle")}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-4"
          >
            {COMING_SOON.map((item, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm"
              >
                <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <div className="text-end">
                  <p className="font-semibold text-foreground">{t(item.nameKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(item.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary to-primary/90">
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
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-primary-foreground mb-3">{t("plugins.ctaTitle")}</motion.h2>
            <motion.p variants={fadeUp} className="text-primary-foreground/80 mb-8 text-lg">
              {t("plugins.ctaSubtitle")}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl px-8 shadow-lg shadow-accent/20"
                onClick={() => setLocation("/register")}
              >
                {t("plugins.registerFree")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl px-8"
                onClick={() => setLocation("/")}
              >
                {t("plugins.backHome")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
