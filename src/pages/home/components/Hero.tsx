import { motion, useScroll, useTransform } from "framer-motion";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";

const TEAL = "#0E7D8A";
const ORANGE = "#F78D3E";

function YMark({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 64.859,64.859 49.366,71.056 41.620,77.254 36.972,83.451 33.873,89.648 32.324,95.845 31.549,102.042 30.775,108.239 31.549,114.437 33.873,120.634 36.972,126.831 40.845,133.028 45.493,139.225 49.366,145.423 54.014,151.620 58.662,157.817 63.310,164.014 67.958,170.211 72.606,176.408 76.479,182.606 81.127,188.803 86.549,195.000 91.197,201.197 95.845,207.394 101.268,213.592 105.915,219.789 111.338,225.986 116.761,232.183 122.958,238.380 129.155,244.577 135.352,250.775 142.324,256.972 149.296,263.169 157.042,269.366 165.563,275.563 174.859,281.761 184.930,287.958 196.549,294.155 220.563,300.352 215.915,306.549 211.268,312.746 206.620,318.944 201.197,325.141 196.549,331.338 190.352,337.535 184.155,343.732 177.958,349.930 169.437,356.127 159.366,362.324 145.423,368.521 136.127,374.718 130.704,380.915 127.606,387.113 126.056,393.310 126.056,399.507 126.056,405.704 127.606,411.901 131.479,418.099 136.127,424.296 143.873,430.493 159.366,435.915 176.408,435.915 198.099,429.718 211.268,423.521 221.338,417.324 230.634,411.127 238.380,404.930 246.127,398.732 252.324,392.535 259.296,386.338 265.493,380.141 270.915,373.944 276.338,367.746 281.761,361.549 287.183,355.352 291.831,349.155 297.254,342.958 301.901,336.761 306.549,330.563 311.197,324.366 316.620,318.169 321.268,311.972 325.915,305.775 331.338,299.577 335.986,293.380 340.634,287.183 346.056,280.986 350.704,274.789 350.704,268.592 327.465,262.394 305.775,256.197 283.310,250.000 236.831,243.803 241.479,237.606 231.408,231.408 221.338,225.211 213.592,219.014 205.845,212.817 199.648,206.620 194.225,200.423 189.577,194.225 184.930,188.028 180.282,181.831 175.634,175.634 170.986,169.437 166.338,163.239 161.690,157.042 157.817,150.845 153.169,144.648 148.521,138.451 143.873,132.254 139.225,126.056 135.352,119.859 130.704,113.662 126.056,107.465 121.408,101.268 116.761,95.070 112.113,88.873 107.465,82.676 102.042,76.479 94.296,70.282 79.577,64.859 Z"
        fill={TEAL}
      />
      <path
        d="M 418.099,64.859 405.704,69.507 398.732,74.155 394.085,78.803 390.211,83.451 386.338,88.099 383.239,92.746 379.366,97.394 375.493,102.042 372.394,106.690 368.521,111.338 364.648,115.986 361.549,120.634 357.676,125.282 353.803,129.930 350.704,134.577 346.831,139.225 342.958,143.873 339.085,148.521 335.986,153.169 332.113,157.817 328.239,162.465 325.141,167.113 321.268,171.761 317.394,176.408 313.521,181.056 310.423,185.704 306.549,190.352 302.676,195.000 299.577,199.648 295.704,204.296 291.831,208.944 287.958,213.592 284.859,218.239 280.986,222.887 277.113,227.535 274.014,232.183 270.141,236.831 266.268,241.479 270.915,246.127 287.958,250.775 304.225,255.423 320.493,260.070 338.310,264.718 352.254,268.592 355.352,268.592 359.225,263.944 363.099,259.296 366.197,254.648 370.070,250.000 373.944,245.352 377.817,240.704 380.915,236.056 384.789,231.408 388.662,226.761 392.535,222.113 395.634,217.465 399.507,212.817 403.380,208.169 406.479,203.521 410.352,198.873 414.225,194.225 417.324,189.577 421.197,184.930 425.070,180.282 428.944,175.634 432.042,170.986 435.915,166.338 439.789,161.690 442.887,157.042 446.761,152.394 450.634,147.746 453.732,143.099 457.606,138.451 460.704,133.803 463.803,129.155 466.127,124.507 467.676,119.859 468.451,115.211 468.451,110.563 468.451,105.915 468.451,101.268 467.676,96.620 466.127,91.972 463.803,87.324 460.704,82.676 457.606,78.028 452.183,73.380 445.211,68.732 432.817,64.859 Z"
        fill={TEAL}
      />
      <circle cx="372.117" cy="379.682" r="24.022" fill={ORANGE} />
    </svg>
  );
}

const STAGGER = 0.08;

export function Hero() {
  const [, setLocation] = useLocation();
  const { t, dir } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-[#141939]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#0E7D8A]/8 blur-3xl dark:bg-[#0E7D8A]/10" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[#F78D3E]/8 blur-3xl dark:bg-[#F78D3E]/10" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100 dark:to-[#141939]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E7D8A]/5 via-transparent to-[#F78D3E]/5 dark:from-[#0E7D8A]/5 dark:to-[#F78D3E]/5" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />

      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full"
        style={{ opacity, y }}
        dir={dir}
      >
        <div className="text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-primary-foreground leading-[1.05] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: STAGGER * 2 }}
          >
            {t("hero.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E7D8A] to-[#F78D3E]">
              {t("hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: STAGGER * 4 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-14"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: STAGGER * 6 }}
          >
            <Button
              onClick={() => setLocation("/register")}
              className="bg-[#F78D3E] text-white hover:bg-[#F78D3E]/90 px-8 py-6 rounded-xl text-base font-bold shadow-2xl shadow-[#F78D3E]/25 hover:shadow-[#F78D3E]/40 transition-all duration-300 group"
            >
              {t("home.hero.getStarted")}
              <ArrowRight className="w-5 h-5 ms-2 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/pricing")}
              className="border-slate-300 hover:bg-slate-100 text-slate-800 px-8 py-6 rounded-xl text-base font-bold dark:border-primary-foreground/20 dark:hover:bg-primary-foreground/10 dark:text-primary-foreground"
            >
              {t("home.hero.viewPricing")}
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 md:gap-12 flex-wrap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: STAGGER * 8 }}
          >
            {[
              { value: "250+", label: t("home.hero.merchants") },
              { value: "15M+", label: t("home.hero.ordersProtected") },
              { value: "40%", label: t("home.hero.rtoReduction") },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium mt-1 dark:text-primary-foreground/40">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-slate-500/60 dark:text-primary-foreground/20" />
      </motion.div>
    </section>
  );
}
