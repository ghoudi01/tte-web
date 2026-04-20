import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeInUp } from "./animations";
import { homeIconMap } from "./iconMap";

const defaultSteps = [
  { num: "1", label: "وضع الطلب", desc: "المشتري يضع طلباً", iconKey: "Package" },
  { num: "2", label: "حساب درجة الثقة", desc: "نظامنا يحسب فوراً", iconKey: "BarChart3" },
  { num: "3", label: "إجراء ذكي", desc: "AI يحدد الإجراء", iconKey: "Shield" },
  { num: "4", label: "شحن أو تحقق", desc: "شحن مباشر أو تأكيد", iconKey: "CheckCircle2" },
];

export function HowItWorks() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const howItWorks = content?.howItWorks;
  const title = howItWorks?.title ?? "كيف يعمل النظام";
  const subtitle = howItWorks?.subtitle ?? "عملية بسيطة في 4 خطوات";
  const steps = howItWorks?.steps ?? defaultSteps;

  return (
    <section
      id="how-it-works"
      className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-b from-white via-slate-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          dir="rtl"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            {subtitle}
          </p>
        </motion.div>

        {/* Timeline: horizontal line + nodes + cards */}
        <div className="max-w-6xl mx-auto" dir="rtl">
          {/* Desktop: horizontal timeline with connecting line */}
          <div className="hidden lg:block relative">
            {/* Connecting line (RTL: runs right to left) */}
            <div
              className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-l from-teal-500 via-teal-400/80 to-teal-500 rounded-full"
              aria-hidden
            />

            <div className="grid grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const StepIcon = step.iconKey ? homeIconMap[step.iconKey] : null;
                return (
                <motion.div
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className="flex flex-col items-center"
                >
                  <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-teal-500 shadow-lg shadow-teal-500/20 flex items-center justify-center">
                      <span className="text-xl font-black text-teal-600">
                        {step.num}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-end pointer-events-none pe-2">
                        <ChevronLeft className="w-6 h-6 text-teal-400/90" />
                      </div>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ y: -4 }}
                    className="mt-6 w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-teal-200/60 transition-all duration-300 text-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        {StepIcon && <StepIcon className="w-6 h-6 text-teal-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 mb-1 text-base">
                          {step.label}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
              })}
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {steps.map((step, idx) => {
              const StepIcon = step.iconKey ? homeIconMap[step.iconKey] : null;
              return (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeInUp}
                className="flex gap-4 items-stretch"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {step.num}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[1rem] bg-gradient-to-b from-teal-300 to-teal-200/50 my-1 rounded-full" />
                  )}
                </div>

                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex-1 bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-teal-200/60 transition-all duration-300 text-start"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      {StepIcon && <StepIcon className="w-5 h-5 text-teal-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">
                        {step.label}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
