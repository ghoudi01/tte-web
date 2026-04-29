import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeInUp, staggerContainer } from "./animations";

export function CTA() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const cta = content?.cta;
  const title = cta?.title ?? "توقف عن شحن الطلبات التي ستفشل";
  const subtitle = cta?.subtitle ?? "ابدأ اليوم وقلل معدلات الارتجاع بنسبة تصل إلى 40% باستخدام الذكاء الاصطناعي";
  const primaryLabel = cta?.primaryLabel ?? "طلب عرض توضيحي";
  const primaryTarget = cta?.primaryTarget ?? "contact";
  const secondaryLabel = cta?.secondaryLabel ?? "الانضمام للبرنامج التجريبي";
  const secondaryTarget = cta?.secondaryTarget ?? "pilot";

  return (
    <section id="cta" className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
          alt="CTA Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById(primaryTarget)?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-teal-600 text-white hover:bg-teal-700 text-lg px-8 py-6 font-semibold shadow-lg"
            >
              {primaryLabel}
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById(secondaryTarget)?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-semibold"
            >
              {secondaryLabel}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
