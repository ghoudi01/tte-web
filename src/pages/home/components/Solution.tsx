import { Shield, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeInUp, fadeInLeft, fadeInRight } from "./animations";

export function Solution() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const solution = content?.solution;
  const title = solution?.title ?? "تعرف على محرك الثقة التونسي";
  const subtitle = solution?.subtitle ?? "نظام ذكاء اصطناعي يمنع الطلبات السيئة، ولا يمنع العملاء الجيدين";
  const highlightText = solution?.highlightText ?? "خوارزميات متقدمة تحلل 300+ معامل في أقل من 200 مللي ثانية لتحديد مستوى المخاطرة";
  const trustScoreTitle = solution?.trustScoreTitle ?? "مثال: درجة الثقة";
  const trustScoreExamples = solution?.trustScoreExamples ?? [
    { score: 85, label: "عميل موثوق", action: "شحن مباشر" },
    { score: 60, label: "متوسط المخاطرة", action: "طلب تأكيد" },
    { score: 30, label: "عالي المخاطرة", action: "طلب دفع جزئي" },
  ];

  return (
    <section id="solution" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-8" dir="rtl"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto text-start">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInLeft}
            className="order-2 lg:order-1 space-y-3 text-right flex flex-col h-full"
          >
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-s-4 border-s-teal-600 p-3 rounded-s-lg shadow-lg" dir="rtl">
              <p className="text-slate-800 font-semibold text-sm leading-relaxed">
                {highlightText}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-slate-200 shadow-lg flex-1 flex flex-col" dir="rtl">
              <div className="flex items-center justify-start gap-2 mb-4">
                <h3 className="text-lg font-bold text-slate-900">{trustScoreTitle}</h3>
                <BarChart3 className="w-5 h-5 text-teal-600 shrink-0" />
              </div>
              <div className="space-y-4 flex-1">
                {trustScoreExamples.map((item, idx) => (
                  <div key={idx} className="space-y-2" dir="rtl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{item.score}/100</span>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2" dir="rtl">
                      <div
                        className="bg-gradient-to-r from-teal-600 to-teal-700 h-2 rounded-full transition-all"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <div className="text-sm text-slate-600">{item.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInRight}
            className="order-1 lg:order-2 relative"
          >
            {/* Solution Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-lg overflow-hidden shadow-xl border-2 border-slate-200 w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="AI Solution"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-800/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                  <div className="text-center">
                    <Shield className="w-10 h-10 text-teal-600 mx-auto mb-1.5" />
                    <div className="text-2xl font-black text-teal-600 mb-0.5">85</div>
                    <div className="text-xs text-slate-600 mb-2">درجة الثقة</div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
                      <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <div className="text-xs font-semibold text-teal-600">✓ شحن آمن</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
