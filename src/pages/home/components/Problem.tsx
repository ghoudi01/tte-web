import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeInUp, fadeInRight } from "./animations";
import { homeIconMap } from "./iconMap";

export function Problem() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const problem = content?.problem;
  const title = problem?.title ?? "الدفع عند الاستلام يكلف التجار";
  const titleHighlight = problem?.titleHighlight ?? "الملايين كل عام";
  const subtitle = problem?.subtitle ?? "كل طلب فاشل يعني خسارة المنتج، تكاليف الشحن، والوقت الضائع";
  const failureRate = problem?.failureRate ?? "30%";
  const failureRateLabel = problem?.failureRateLabel ?? "معدل الفشل";
  const failureCardText = problem?.failureCardText ?? "طلبات فاشلة تؤدي إلى خسائر كبيرة";
  const stats = problem?.stats ?? [
    { value: "30%", label: "طلبات فاشلة", iconKey: "XCircle" },
    { value: "15-20%", label: "خسائر تشغيلية", iconKey: "TrendingDown" },
    { value: "40%", label: "تقليل التدفق النقدي", iconKey: "AlertTriangle" },
  ];

  return (
    <section id="problem" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-b from-white via-slate-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-8" dir="rtl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 text-start">
            {title}{" "}
            <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto text-start">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 h-full min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80"
                alt="Failed Delivery Problem"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/50 to-transparent"></div>

              <div className="absolute top-4 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl" dir="rtl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shrink-0">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-start min-w-0">
                      <div className="text-3xl font-black text-slate-900 leading-none">{failureRate}</div>
                      <div className="text-xs font-semibold text-slate-600 mt-1">{failureRateLabel}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 font-medium text-start">{failureCardText}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {stats.map((item, idx) => {
              const Icon = item.iconKey ? homeIconMap[item.iconKey] : null;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200 hover:border-slate-300 transition-all" dir="rtl"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1 text-start min-w-0">
                    <div className="text-2xl font-black text-slate-900">{item.value}</div>
                    <div className="text-sm font-semibold text-slate-600 mt-0.5">{item.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
