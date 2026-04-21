import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { staggerContainer, fadeInLeft, fadeInRight } from "./animations";

export function SocialProof() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const socialProof = content?.socialProof;
  const stats = socialProof?.stats ?? [
    { value: "250+", label: "علامة تجارية" },
    { value: "15M+", label: "طلب معالج" },
    { value: "40%", label: "تقليل RTO" },
  ];

  return (
    <section className="h-[25vh] flex items-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700 w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center py-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row items-center md:justify-between gap-6 w-full"
        >
          <motion.div 
            variants={fadeInLeft}
            className="flex items-center gap-8"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                    className="text-3xl font-black text-white mb-1"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
                {idx < 2 && <div className="h-12 w-px bg-slate-700"></div>}
              </div>
            ))}
          </motion.div>
          <motion.div 
            variants={fadeInRight}
            className="text-right max-w-md md:max-w-none md:ml-auto"
          >
            <p className="text-lg text-white font-semibold mb-1">
              {socialProof?.tagline ??
                "مصمم خصيصاً للأسواق التي تهيمن عليها الدفع عند الاستلام"}
            </p>
            <p className="text-sm text-slate-400">
              {socialProof?.subline ??
                "مبني لتونس والأسواق المماثلة"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

