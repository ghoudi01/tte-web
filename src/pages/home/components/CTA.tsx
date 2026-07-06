import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "./animations";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTA() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-primary/80" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1]">
            {t("home.cta.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.cta.titleHighlight")}
            </span>
        </motion.h2>

          <motion.p variants={fadeUp} className="text-base md:text-lg text-primary-foreground/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("home.cta.subtitle")}
          </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setLocation("/register")}
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-10 py-6 font-bold rounded-xl shadow-2xl shadow-accent/20 hover:shadow-accent/30 transition-all duration-300 group"
          >
            {t("home.cta.startFree")}
            <ArrowRight className="w-5 h-5 ms-2 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-10 py-6 font-bold rounded-xl transition-all duration-300"
          >
            {t("home.cta.talkToSales")}
          </Button>
        </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-6 flex-wrap text-sm text-primary-foreground/40">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent/60" />
            {t("home.cta.noCreditCard")}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent/60" />
            {t("home.cta.freeTrial")}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent/60" />
            {t("home.cta.cancelAnytime")}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
