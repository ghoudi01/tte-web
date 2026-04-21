import { motion } from "framer-motion";
import {
  Lightbulb,
  MessageCircleMore,
  Route,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeIn, staggerContainer } from "./animations";

const keyToIcon = {
  whatsapp_validation: MessageCircleMore,
  shipping_recommendation: Route,
  trust_explainability: ShieldCheck,
  growth_experiments: Lightbulb,
} as const;

export function RoadmapIdeas() {
  const { data: ideas = [], isLoading } =
    trpc.automation.getRoadmapIdeas.useQuery();

  return (
    <section id="roadmap" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <Lightbulb className="w-4 h-4" />
            أفكار التوسّع القادمة
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-black text-slate-900 mb-3"
          >
            خارطة تطوير عملية لـ TTE
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            هذه أفكار جاهزة للتنفيذ تساعد التجار على رفع التحويل وتقليل الخسائر
            من الطلبات عالية المخاطر.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {(isLoading ? [] : ideas).map(idea => {
            const Icon =
              keyToIcon[idea.key as keyof typeof keyToIcon] ?? Lightbulb;
            return (
              <motion.div
                key={idea.key}
                variants={fadeIn}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  {idea.implemented && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"
                      title="متاح في المنصة"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      متاح
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 mb-2">
                  {idea.title}
                </h3>
                <p className="text-sm text-slate-600 leading-6">
                  {idea.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
