import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "./animations";

export function DashboardPreview() {
  return (
    <section className="pt-2 pb-12 md:pt-3 md:pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-4 md:mb-6"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-3">
            لوحة تحكم شاملة
          </h2>
          <p className="text-xl text-slate-300">
            راقب أداءك في الوقت الفعلي واتخذ قرارات مدعومة بالبيانات
          </p>
        </motion.div>

        {/* Dashboard Image */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 max-w-6xl mx-auto"
        >
          {/* Overlay Content */}
          <div className="relative flex items-end">
            <div className="w-full bg-slate-900/95 backdrop-blur-sm p-4">
              <div className="max-w-6xl mx-auto">
                <div className="bg-slate-800 rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-white">نظرة عامة على الطلبات</h3>
                      <p className="text-xs text-slate-400">آخر 30 يوماً</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "إجمالي الطلبات", value: "1,234", change: "+12%", color: "text-slate-300" },
                      { label: "معدل RTO", value: "18%", change: "-40%", color: "text-teal-400" },
                      { label: "درجة ثقة متوسطة", value: "72", change: "+5", color: "text-teal-400" },
                      { label: "طلبات محظورة", value: "89", change: "+23", color: "text-slate-400" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-right">
                        <div className="text-xs text-slate-400 mb-0.5">{stat.label}</div>
                        <div className={`text-xl font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
                        <div className="text-xs text-slate-500">{stat.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Order List Preview */}
                  <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="text-xs font-semibold text-white mb-2 text-right">طلبات حديثة</div>
                    <div className="space-y-1.5">
                      {[
                        { phone: "+216 XX XXX XXX", score: 85, status: "موثوق" },
                        { phone: "+216 XX XXX XXX", score: 45, status: "محظور" },
                        { phone: "+216 XX XXX XXX", score: 65, status: "تأكيد" }
                      ].map((order, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900 rounded p-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${order.status === "موثوق" ? "bg-teal-500" : order.status === "محظور" ? "bg-slate-500" : "bg-slate-400"} rounded-full`}></div>
                            <span className="text-xs text-slate-300">{order.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-slate-400">درجة: <span className="text-white font-medium">{order.score}</span></div>
                            <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === "موثوق" ? "bg-teal-500/20 text-teal-400" :
                              order.status === "محظور" ? "bg-slate-500/20 text-slate-400" :
                              "bg-slate-400/20 text-slate-300"
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
