import { motion, useInView } from "framer-motion";
import { Zap, Lock, BarChart3, Globe, Users, TrendingUp } from "lucide-react";
import { fadeUp, stagger, cardHover } from "./animations";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Features() {
  const { t } = useLanguage();
  const features = [
    { icon: Zap, title: t("home.features.realtimeScoring"), desc: t("home.features.realtimeScoringDesc"), gradient: "from-accent/20 to-accent/5", border: "border-accent/20" },
    { icon: Lock, title: t("home.features.fraudDetection"), desc: t("home.features.fraudDetectionDesc"), gradient: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
    { icon: BarChart3, title: t("home.features.smartAnalytics"), desc: t("home.features.smartAnalyticsDesc"), gradient: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20" },
    { icon: Globe, title: t("home.features.multiplatform"), desc: t("home.features.multiplatformDesc"), gradient: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20" },
    { icon: Users, title: t("home.features.phoneVerification"), desc: t("home.features.phoneVerificationDesc"), gradient: "from-green-500/20 to-green-500/5", border: "border-green-500/20" },
    { icon: TrendingUp, title: t("home.features.rtoReduction"), desc: t("home.features.rtoReductionDesc"), gradient: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/20" },
  ];
  return (
    <section id="benefits" className="py-14 md:py-20 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
            className="text-center mb-10 md:mb-14"
          >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3">
                        {t("home.features.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.features.titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("home.features.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardHover}
              whileHover="hover"
              className="group cursor-default"
            >
              <div className={`h-full bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-2xl p-6 md:p-8 border ${feature.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="w-12 h-12 bg-background/50 backdrop-blur-sm rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-border/30">
                  <feature.icon className="w-6 h-6 text-foreground/80" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
