import { Coins, Zap, Gift, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { fadeInUp, fadeInLeft, fadeInRight } from "./animations";

export function BusinessModel() {
  const [, setLocation] = useLocation();
  const plans = [
    {
      icon: Coins,
      title: "شراء الاعتمادات",
      price: "من 9.99",
      period: "د.ت",
      description: "اشترِ حزمة اعتمادات تناسبك — 50، 150، 400 أو 1000 اعتماد. كلما اشتريت أكثر، كان السعر أفضل.",
      features: [
        "بدون اشتراك شهري",
        "اعتمادات لا تنتهي صلاحيتها",
        "مكافأة على الحزم الكبيرة",
        "10 اعتمادات مجانية عند التسجيل"
      ],
      gradient: "from-teal-600 to-teal-700",
      bgGradient: "from-slate-50 to-slate-100/50",
      buttonText: "شراء الاعتمادات",
      buttonLink: "/pricing",
      popular: false
    },
    {
      icon: Zap,
      title: "استهلاك الاعتمادات",
      price: "5 / 2",
      period: "اعتماد",
      description: "فحص رقم هاتف: 5 اعتمادات. إعادة فحص نفس الرقم: 2 اعتماد. دفع عادل حسب الاستخدام.",
      features: [
        "فحص أول مرة: 5 اعتمادات",
        "إعادة فحص: 2 اعتماد",
        "API بنفس الأسعار",
        "شفافية كاملة"
      ],
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-slate-50 to-slate-100/50",
      buttonText: "جرب التحقق",
      buttonLink: "/register",
      popular: true
    },
    {
      icon: Gift,
      title: "كسب الاعتمادات",
      price: "+2 / +3",
      period: "اعتماد",
      description: "اكسب اعتمادات بدون شراء: تقرير مقبول = +2، إحالة تُتم أول تحقق = +3 اعتمادات.",
      features: [
        "تقرير مقبول: +2 اعتماد",
        "إحالة أول تحقق: +3 اعتمادات",
        "ساهم في قاعدة الثقة",
        "قلل التكلفة الصافية"
      ],
      gradient: "from-emerald-600 to-emerald-700",
      bgGradient: "from-slate-50 to-slate-100/50",
      buttonText: "التسجيل",
      buttonLink: "/register",
      popular: false
    }
  ];

  return (
    <section className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-br from-white via-slate-50/30 to-white relative overflow-hidden">
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
            نظام الاعتمادات
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            اشترِ اعتمادات، استهلكها للتحقق، واكسبها بالتقارير والإحالات
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={idx === 0 ? fadeInLeft : idx === 2 ? fadeInRight : fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    الأكثر استخداماً
                  </span>
                </div>
              )}
              <div className={`bg-gradient-to-br ${plan.bgGradient} rounded-2xl p-6 border-2 ${plan.popular ? 'border-amber-300 shadow-xl' : 'border-slate-200/50'} shadow-lg hover:shadow-2xl transition-all duration-300 h-full`} dir="rtl">
                <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-slate-600">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 ${plan.popular ? 'text-amber-600' : 'text-slate-600'} flex-shrink-0 mt-0.5`} />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setLocation(plan.buttonLink)}
                  className={`block w-full text-center py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-br ${plan.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
