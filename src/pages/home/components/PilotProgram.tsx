import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, CheckCircle2, Rocket } from "lucide-react";
import { fadeInUp, scaleIn } from "./animations";

export function PilotProgram() {
  const [pilotEmail, setPilotEmail] = useState("");

  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pilot signup:", pilotEmail);
  };

  const benefits = [
    "100 فحص مجاني",
    "دعم فني كامل",
    "مدة 30 يوم",
    "وصول مبكر للميزات الجديدة"
  ];

  return (
    <section id="pilot" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-br from-slate-50 via-slate-50/30 to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-8"
          dir="rtl"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            انضم إلى البرنامج التجريبي
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            احصل على وصول مجاني مع دعم كامل - متاح للمتبنين الأوائل
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-center">
          {/* Benefits List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg"
            dir="rtl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-6 h-6 text-teal-600" />
              <h3 className="text-xl font-bold text-slate-900">مميزات البرنامج</h3>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 md:p-8 border-2 border-slate-200 shadow-xl"
            dir="rtl"
          >
            <form onSubmit={handlePilotSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={pilotEmail}
                  onChange={(e) => setPilotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                  dir="ltr"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 py-4 font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                الانضمام الآن
              </Button>
              <p className="text-xs text-center text-slate-500 mt-2">
                انضم مجاناً وابدأ في غضون دقائق
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

