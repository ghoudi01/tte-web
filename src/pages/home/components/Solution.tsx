import { motion } from "framer-motion";
import { Shield, CheckCircle2, ArrowUpRight } from "lucide-react";
import { fadeUp, stagger } from "./animations";
import { useLanguage } from "@/contexts/LanguageContext";

const factors = [
  { labelKey: "phoneValidation", score: 25 },
  { labelKey: "addressCheck", score: 20 },
  { labelKey: "orderPattern", score: 20 },
  { labelKey: "customerHistory", score: 15 },
  { labelKey: "paymentMethod", score: 10 },
  { labelKey: "shippingAddress", score: 10 },
];

function MetricRing({ value, label }: { value: number; label: string }) {
  const { t } = useLanguage();
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
          className="text-accent"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 60 60)"
        />
        <motion.text
          x="60" y="54" textAnchor="middle"
          className="fill-foreground font-black text-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          {value}
        </motion.text>
        <text x="60" y="74" textAnchor="middle" className="fill-muted-foreground text-xs font-medium">/ 100</text>
      </svg>
      <span className="text-sm font-bold text-foreground mt-1">{label}</span>
    </div>
  );
}

function Bar({ label, score, delay }: { label: string; score: number; delay: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3"
    >
      <span className="text-sm text-muted-foreground w-36 shrink-0">{label}</span>
      <div className="flex-1 bg-muted/30 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: "0%" }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-sm font-bold text-foreground tabular-nums w-8 text-end">{score}%</span>
    </motion.div>
  );
}

export function Solution() {
  const { t } = useLanguage();
  return (
    <section id="solution" className="py-14 md:py-20 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3">
            {t("home.solution.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.solution.titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.solution.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-6xl mx-auto bg-card/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold text-foreground uppercase tracking-wider">{t("home.solution.liveRisk")}</span>
            </div>
            <motion.div
              className="flex items-center gap-1.5 text-sm text-accent font-semibold"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {t("home.solution.processing")}
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              <MetricRing value={85} label={t("home.solution.trustScore")} />
            </div>

            <div className="flex-1 w-full space-y-2.5">
              {factors.map((f, i) => (
                <Bar key={i} label={t(`home.solution.${f.labelKey}`)} score={f.score} delay={i * 0.06} />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>
                Total: <span className="font-bold text-foreground">100%</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-accent font-semibold">
              {t("home.solution.lowRisk")}
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
