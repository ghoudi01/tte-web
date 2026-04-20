import { XCircle, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight } from "./animations";

export function BeforeAfter() {
  const metrics = [
    { 
      label: "معدل RTO", 
      before: 30, 
      after: 18, 
      improvement: 40, 
      unit: "%",
      direction: "down" 
    },
    { 
      label: "خسائر شهرية", 
      before: 15, 
      after: 9, 
      improvement: 40, 
      unit: "%",
      direction: "down" 
    },
    { 
      label: "كفاءة الشحن", 
      before: 70, 
      after: 91, 
      improvement: 30, 
      unit: "%",
      direction: "up" 
    }
  ];

  return (
    <section className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-br from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-8 md:mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            قبل وبعد محرك الثقة التونسي
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            قارن الفرق في أداء عملك
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Before Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInLeft}
            whileHover={{ y: -4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border-2 border-slate-200 shadow-lg" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">قبل الاستخدام</h3>
              </div>
              <div className="space-y-3">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 border border-slate-200/50 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl font-black text-slate-900">{metric.before}{metric.unit}</span>
                      <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2" dir="rtl">
                      <div 
                        className="bg-gradient-to-r from-slate-600 to-slate-700 h-2 rounded-full transition-all" 
                        style={{ width: `${metric.before}%` }} 
                      />
                    </div>
                    <div className="text-[9px] font-medium mt-0.5 opacity-0">
                      &nbsp;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* After Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInRight}
            whileHover={{ y: -4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border-2 border-teal-200 shadow-lg" dir="rtl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">بعد الاستخدام</h3>
              </div>
              <div className="space-y-3">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 border border-slate-200/50 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        {metric.direction === "down" ? (
                          <TrendingDown className="w-3 h-3 text-teal-600" />
                        ) : (
                          <TrendingUp className="w-3 h-3 text-teal-600" />
                        )}
                        <span className="text-xl font-black text-teal-600">{metric.after}{metric.unit}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2" dir="rtl">
                      <div 
                        className="bg-gradient-to-r from-teal-600 to-teal-700 h-2 rounded-full transition-all" 
                        style={{ width: `${metric.after}%` }} 
                      />
                    </div>
                    <div className={`text-[9px] font-medium mt-0.5 text-teal-600`}>
                      {metric.direction === "down" ? "↓" : "↑"} {metric.improvement}% تحسين
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

