import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Lock, Target, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./animations";

export function WhyTrustUs() {
  return (
    <section className="pt-4 pb-32 md:pt-6 md:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            لماذا تثق بنا
          </h2>
          <p className="text-xl text-slate-600">
            قرارات مدعومة بالذكاء الاصطناعي، وليس يدوياً
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Zap,
              title: "مدعوم بالذكاء الاصطناعي",
              description: "خوارزميات متقدمة تتعلم من كل معاملة لتحسين الدقة باستمرار"
            },
            {
              icon: Lock,
              title: "إخفاء الهوية",
              description: "جميع البيانات مشفرة ومجهولة. لا نشارك معلومات شخصية بين التجار"
            },
            {
              icon: Target,
              title: "ذكاء السوق المحلي",
              description: "مصمم خصيصاً للسوق التونسي. نفهم تحديات التجارة الإلكترونية المحلية"
            },
            {
              icon: Globe,
              title: "مبني لاقتصاديات CoD",
              description: "مصمم خصيصاً للأسواق التي تهيمن عليها الدفع عند الاستلام"
            }
          ].map((trust, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-2 border-slate-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                    <trust.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">{trust.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm leading-relaxed">{trust.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
