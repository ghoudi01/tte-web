import { motion } from "framer-motion";
import { XCircle, TrendingDown, AlertTriangle } from "lucide-react";
import { fadeUp, stagger, cardHover } from "./animations";
import { useLanguage } from "@/contexts/LanguageContext";

export function Problem() {
  const { t } = useLanguage();
  const painPoints = [
    {
      icon: XCircle,
      value: "30%",
      label: t("home.problem.failedDeliveries"),
      desc: t("home.problem.failedDeliveriesDesc"),
      color: "from-red-400/20 to-red-500/10",
      border: "border-red-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
    {
      icon: TrendingDown,
      value: "15-20%",
      label: t("home.problem.revenueLost"),
      desc: t("home.problem.revenueLostDesc"),
      color: "from-orange-400/20 to-orange-500/10",
      border: "border-orange-500/20",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
    {
      icon: AlertTriangle,
      value: "40%",
      label: t("home.problem.manualReview"),
      desc: t("home.problem.manualReviewDesc"),
      color: "from-amber-400/20 to-amber-500/10",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
  ];
  return (
    <section id="problem" className="py-14 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px]" />
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
                        {t("home.problem.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              {t("home.problem.titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("home.problem.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              variants={cardHover}
              whileHover="hover"
              className="group cursor-default"
            >
              <div className={`h-full bg-gradient-to-br ${point.color} backdrop-blur-sm rounded-2xl p-6 md:p-8 border ${point.border} shadow-xl`}>
                <div className={`w-14 h-14 ${point.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <point.icon className={`w-7 h-7 ${point.iconColor}`} />
                </div>
                <div className="text-3xl font-black text-foreground mb-1">{point.value}</div>
                <div className="text-sm font-bold text-foreground/80 mb-3">{point.label}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 text-muted-foreground/60 text-sm">
            <span className="h-px w-12 bg-border" />
            {t("home.problem.divider")}
            <span className="h-px w-12 bg-border" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
