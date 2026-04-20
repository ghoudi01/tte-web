import { motion } from "framer-motion";
import { Truck, Link2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { fadeIn, staggerContainer } from "./animations";

export function ShippingPartners() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const section = content?.shippingSection;
  const companies = content?.shippingPartners ?? [];
  const ctaLabel = section?.ctaLabel ?? "طلب الربط";

  return (
    <section className="py-20 bg-white">
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
            className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <Truck className="w-4 h-4" />
            {section?.badge ?? "تكاملات شركات الشحن في تونس"}
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-black text-slate-900 mb-3"
          >
            {section?.title ?? "اربط TTE مع شركات الشحن بسهولة"}
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            {section?.subtitle ??
              "اختر شركة الشحن الأنسب لكل طلب حسب المخاطر والمنطقة لرفع نسبة التسليم."}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {companies.map(company => (
            <motion.div
              key={company.name}
              variants={fadeIn}
              className="border border-slate-200 rounded-xl p-4"
            >
              <h3 className="font-bold text-slate-900">{company.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{company.focus}</p>
              <button className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
                <Link2 className="w-4 h-4" />
                {ctaLabel}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
