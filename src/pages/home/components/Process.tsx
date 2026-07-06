import { motion, useInView } from "framer-motion";
import { Package, BarChart3, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { fadeUp } from "./animations";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const steps = [
  { num: "01", icon: Package, labelKey: "step1Title", descKey: "step1Desc", color: "from-accent/20 to-accent/5", border: "border-accent/20" },
  { num: "02", icon: BarChart3, labelKey: "step2Title", descKey: "step2Desc", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
  { num: "03", icon: Shield, labelKey: "step3Title", descKey: "step3Desc", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20" },
  { num: "04", icon: CheckCircle2, labelKey: "step4Title", descKey: "step4Desc", color: "from-accent/20 to-accent/5", border: "border-accent/20" },
];

function StepCard({ step, idx }: { step: typeof steps[0]; idx: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50, y: 30 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-start gap-6 group"
    >
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: idx * 0.15 + 0.2, type: "spring", stiffness: 150 }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} border ${step.border} flex items-center justify-center shadow-lg relative z-10 backdrop-blur-sm`}
        >
          <step.icon className="w-7 h-7 text-foreground/80" />
        </motion.div>
        {idx < steps.length - 1 && (
          <div className="w-0.5 flex-1 min-h-[3rem] bg-gradient-to-b from-accent/30 to-accent/5 my-2" />
        )}
      </div>

      <div className="flex-1 pt-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-black text-accent/60 tracking-widest">{step.num}</span>
          <h3 className="text-lg font-bold text-foreground">{t(`home.process.${step.labelKey}`)}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{t(`home.process.${step.descKey}`)}</p>
      </div>
    </motion.div>
  );
}

export function Process() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="py-14 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px]" />
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
            {t("home.process.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.process.titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("home.process.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, idx) => (
            <StepCard key={idx} step={step} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
