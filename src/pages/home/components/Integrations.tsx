import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { fadeInUp, staggerContainer } from "./animations";
import { homeIconMap } from "./iconMap";

export function Integrations() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const integrations = content?.integrations;
  const title = integrations?.title ?? "تكامل سريع وسهل";
  const subline = integrations?.subline ?? "API-first • جاهز للاستخدام • تكامل سريع";
  const items = integrations?.items ?? [
    { title: "API-First", description: "تكامل برمجي سهل مع أي منصة تجارة إلكترونية", iconKey: "Code" },
    { title: "جاهز للاستخدام", description: "تكامل مباشر مع Shopify و WooCommerce والمنصات الرئيسية", iconKey: "Plug" },
    { title: "تكامل سريع", description: "كل الأنظمة تعمل خلال 36 ساعة من إتمام الصفقة", iconKey: "Zap" },
  ];

  return (
    <section className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
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
            {title}
          </h2>
          <p className="text-xl text-slate-600">
            {subline}
          </p>
        </motion.div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {items.map((integration, idx) => {
            const Icon = integration.iconKey ? homeIconMap[integration.iconKey] : null;
            return (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-slate-200 text-center hover:border-slate-300 transition-colors h-full bg-white shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${idx === 1 ? 'from-teal-600 to-teal-700' : 'from-slate-700 to-slate-900'} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {Icon && <Icon className="w-8 h-8 text-white" />}
                  </div>
                  <CardTitle className="text-slate-900 text-xl">{integration.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm leading-relaxed">{integration.description}</p>
                </CardContent>
              </Card>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

