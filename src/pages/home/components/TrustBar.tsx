import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { stagger } from "./animations";
import { useLanguage } from "@/contexts/LanguageContext";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasRun = useRef(false);

  if (isInView && !hasRun.current) {
    hasRun.current = true;
    const startTime = performance.now();
    const duration = 2000;
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) {
        ref.current.textContent = Math.floor(eased * end) + suffix;
      }
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  return <span ref={ref}>0{suffix}</span>;
}

export function TrustBar() {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-14 bg-primary relative overflow-hidden border-y border-primary-foreground/5">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {[
            { value: 250, suffix: "+", label: t("home.trustBar.activeMerchants") },
            { value: 15, suffix: "M+", label: t("home.trustBar.ordersAnalyzed") },
            { value: 40, suffix: "%", label: t("home.trustBar.avgRtoReduction") },
            { value: 99.9, suffix: "%", label: t("home.trustBar.uptimeSla") },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 100, damping: 12 }}
              className="text-center group"
            >
              <div className="text-3xl md:text-4xl font-black text-primary-foreground mb-1 tabular-nums">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-primary-foreground/50 font-medium tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
