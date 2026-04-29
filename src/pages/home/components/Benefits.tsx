import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Users, Package } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "./animations";

export function Benefits() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const benefits = content?.benefits;
  const title = benefits?.title ?? "الفوائد الرئيسية";
  const subtitle = benefits?.subtitle ?? "قيمة حقيقية للتجار وشركات الشحن";
  const forMerchantsTitle = benefits?.forMerchantsTitle ?? "للتجار";
  const forMerchants = benefits?.forMerchants ?? [
    "تقليل الارتجاع وخصم التكاليف",
    "تحسين التدفق النقدي",
    "قرار شحن أسرع وواضح",
  ];
  const forCarriersTitle = benefits?.forCarriersTitle ?? "لشركات الشحن";
  const forCarriers = benefits?.forCarriers ?? [
    "تقليل الطلبات الفاشلة",
    "معلومات مخاطر مسبقة",
    "تكامل سهل مع المنصات",
  ];

  return (
    <section id="benefits" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-br from-slate-50 via-slate-50/30 to-slate-50/40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200 rounded-full blur-3xl"></div>
      </div>
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-600">
            {subtitle}
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-8"
        >
          <motion.div
            variants={fadeInLeft}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors h-full bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{forMerchantsTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {forMerchants.map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            variants={fadeInRight}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors h-full bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{forCarriersTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {forCarriers.map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
