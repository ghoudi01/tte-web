import { motion } from "framer-motion";
import { Check, Coins } from "lucide-react";
import { useLocation } from "wouter";
import { fadeUp, fadeLeft, fadeRight } from "./animations";
import { useLanguage } from "@/contexts/LanguageContext";

export function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: "Starter",
      price: "9.99",
      credits: "50",
      desc: t("home.pricing.forSmall"),
      features: [t("home.pricing.creditsIncluded", { credits: "50" }), t("home.pricing.basicScoring"), t("home.pricing.emailSupport"), "7-day free trial"],
      gradient: "from-muted/20 to-muted/5",
      border: "border-border/50",
      popular: false,
    },
    {
      name: "Standard",
      price: "24.99",
      credits: "150",
      desc: t("home.pricing.forGrowing"),
      features: [t("home.pricing.creditsIncluded", { credits: "150" }), t("home.pricing.advancedScoring"), t("home.pricing.phoneVerificationFeature"), t("home.pricing.prioritySupport")],
      gradient: "from-accent/10 to-accent/5",
      border: "border-accent/30",
      popular: true,
    },
    {
      name: "Growth",
      price: "59.99",
      credits: "400",
      desc: t("home.pricing.forScaling"),
      features: [t("home.pricing.creditsIncluded", { credits: "400" }), t("home.pricing.customModels"), t("home.pricing.phoneVerificationFeature"), t("home.pricing.dedicatedManager"), t("home.pricing.apiAccess")],
      gradient: "from-blue-500/10 to-blue-500/5",
      border: "border-blue-500/20",
      popular: false,
    },
  ];
  const [, setLocation] = useLocation();

  return (
    <section id="pricing" className="py-14 md:py-20 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
            className="text-center mb-10"
          >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3">
            {t("home.pricing.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.pricing.titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.pricing.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={i === 0 ? fadeLeft : i === 2 ? fadeRight : fadeUp}
              className="relative group"
            >
              {plan.popular && (
                <div className="absolute -top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-accent to-accent/80 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                    {t("home.pricing.mostPopular")}
                  </span>
                </div>
              )}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`h-full bg-gradient-to-br ${plan.gradient} backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 ${plan.popular ? plan.border + " shadow-2xl shadow-accent/10" : plan.border + " shadow-xl"} hover:shadow-2xl transition-all duration-300`}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{t("orders.currencyTnd")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Coins className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">{plan.credits} {t("home.pricing.credits")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-0.5">
                    {t("home.pricing.neverExpire")}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setLocation("/register")}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-300 ${
                    plan.popular
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl"
                      : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border/50"
                  }`}
                >
                  {t("home.pricing.getStarted")}
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
