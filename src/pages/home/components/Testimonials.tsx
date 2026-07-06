import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp } from "./animations";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    quoteKey: "quote1",
    authorKey: "author1",
    roleKey: "role1",
    rating: 5,
  },
  {
    quoteKey: "quote2",
    authorKey: "author2",
    roleKey: "role2",
    rating: 5,
  },
  {
    quoteKey: "quote3",
    authorKey: "author3",
    roleKey: "role3",
    rating: 5,
  },
];

export function Testimonials() {
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
            className="text-center mb-10 md:mb-14"
          >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3">
            {t("home.testimonials.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.testimonials.titleHighlight")}
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div className="h-full bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">&ldquo;{t(`home.testimonials.${testimonial.quoteKey}`)}&rdquo;</p>
                <div>
                  <div className="font-bold text-foreground text-sm">{t(`home.testimonials.${testimonial.authorKey}`)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t(`home.testimonials.${testimonial.roleKey}`)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
