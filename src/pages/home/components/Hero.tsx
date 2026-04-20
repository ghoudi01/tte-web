import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { fadeIn } from "./animations";
import { homeIconMap } from "./iconMap";

export function Hero() {
  const [, setLocation] = useLocation();
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const hero = content?.hero;
  const quickStats = hero?.quickStats ?? [];

  return (
    <section className="relative min-h-[78vh] md:min-h-[84vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80"
          alt="AI Technology"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
      </div>

      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex items-center">
        <div className="flex justify-start items-center w-full" dir="rtl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="text-start max-w-4xl"
          >
            <motion.h1
              variants={fadeIn}
              className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 leading-tight"
            >
              <span className="block">
                {hero
                  ? hero.title.replace(hero.titleHighlight, "").trim()
                  : "توقف عن شحن الطلبات"}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-500">
                {hero?.titleHighlight ?? "التي ستفشل"}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-base md:text-xl text-slate-300 mb-7 leading-relaxed"
            >
              {hero?.subtitle ??
                "محرك الثقة التونسي يساعدك على كشف الطلبات عالية المخاطر قبل الشحن عبر الذكاء الاصطناعي والتحقق الذكي."}
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <Button
                onClick={() => setLocation("/register")}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg"
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/pricing")}
                className="bg-white/10 border-white/30 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
              >
                شاهد الأسعار
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="grid sm:grid-cols-3 gap-3">
              {quickStats.map(item => {
                const Icon =
                  item.iconKey && homeIconMap[item.iconKey]
                    ? homeIconMap[item.iconKey]
                    : null;
                return (
                  <div
                    key={item.label}
                    className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-teal-300 mb-1">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    <div className="text-white font-extrabold">
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
