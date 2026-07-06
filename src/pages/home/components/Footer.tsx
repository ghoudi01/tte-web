import { Mail, Phone, MapPin, Github, Twitter, Linkedin, ArrowUpRight, Heart, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { YakeenLogo } from "@/components/YakeenLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";

type FooterNavLink = { label: string; targetId: string };

const FOOTER_NAV_ORDER: Record<string, number> = {
  problem: 0,
  solution: 1,
  "how-it-works": 2,
  benefits: 3,
  contact: 4,
};

function mergeFooterNavLinks(
  product: FooterNavLink[],
  company: FooterNavLink[]
): FooterNavLink[] {
  const withTargets = [...product, ...company.filter(l => l.targetId)];
  const byId = new Map<string, FooterNavLink>();
  for (const link of withTargets) {
    const id = link.targetId.trim();
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, { ...link, targetId: id });
  }
  return Array.from(byId.values()).sort(
    (a, b) =>
      (FOOTER_NAV_ORDER[a.targetId] ?? 99) -
      (FOOTER_NAV_ORDER[b.targetId] ?? 99)
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Footer() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const footer = content?.footer;
  const brandName = footer?.brandName ?? t("nav.brand");
  const email = footer?.email ?? t("footer.email");
  const phone = footer?.phone ?? t("footer.phone");
  const location = footer?.location ?? t("footer.location");
  const defaultProductLinks: FooterNavLink[] = [
    { label: t("nav.solution"), targetId: "solution" },
    { label: t("nav.howItWorks"), targetId: "how-it-works" },
    { label: t("benefits.title"), targetId: "benefits" },
  ];
  const defaultCompanyLinks: FooterNavLink[] = [
    { label: t("nav.problem"), targetId: "problem" },
    { label: t("nav.contact"), targetId: "contact" },
  ];
  const footerNavLinks = mergeFooterNavLinks(
    footer?.productLinks ?? defaultProductLinks,
    footer?.companyLinks ?? defaultCompanyLinks
  );
  const copyright = footer?.copyright ?? t("footer.copyright");
  const privacyLabel = footer?.privacyLabel ?? t("footer.privacy");
  const termsLabel = footer?.termsLabel ?? t("footer.terms");
  const socialLinks = [
    { icon: Github, href: "#", label: t("footer.github") },
    { icon: Twitter, href: "#", label: t("footer.twitter") },
    { icon: Linkedin, href: "#", label: t("footer.linkedin") },
    { icon: Mail, href: `mailto:${email}`, label: t("footer.emailLabel") },
  ];

  return (
    <footer className="bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23151A3B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="py-16 md:py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
              <motion.div variants={itemVariants} className="lg:col-span-5" dir={dir}>
              <YakeenLogo size={48} showText />
              <p className="text-sm text-foreground/70 leading-relaxed max-w-md mb-6 mt-4">
                {t("footer.description")}
              </p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 bg-foreground/10 hover:bg-accent/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-foreground/5"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-foreground/70" />
                  </a>
                ))}
                <div className="flex items-center gap-2 text-xs text-foreground/50 px-3 py-2 bg-foreground/10 rounded-xl border border-foreground/5">
                  <MapPin className="w-3.5 h-3.5 text-accent/80" />
                  <span>{location}</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-3" dir={dir}>
              <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-widest">
                {t("footer.product")}
              </h4>
              <ul className="space-y-3">
                {footerNavLinks.map((link: FooterNavLink) => (
                  <li key={link.targetId}>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.location.pathname === "/") {
                          document
                            .getElementById(link.targetId)
                            ?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          setLocation("/");
                          requestAnimationFrame(() => {
                            window.location.hash = link.targetId;
                          });
                        }
                      }}
                      className="text-sm text-foreground/60 hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-4" dir={dir}>
              <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-widest">
                {t("contact.title")}
              </h4>
              <div className="space-y-3.5">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-foreground/60 hover:text-accent transition-colors group"
                >
                  <div className="w-9 h-9 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>{email}</span>
                </a>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-foreground/60 hover:text-accent transition-colors group"
                >
                  <div className="w-9 h-9 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span dir="ltr">{phone}</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-foreground/60">
                  <div className="w-9 h-9 bg-foreground/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-accent/80" />
                  </div>
                  <span>{location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-foreground/10 py-6"
        >
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-4"
            dir={dir}
          >
            <p className="text-xs text-foreground/40 text-center md:text-start flex items-center gap-1">
              {copyright}
              <Heart className="w-3 h-3 text-accent/60 inline-block mx-0.5" />
            </p>
            <div className="flex items-center gap-4">
              <ThemeToggle className="text-foreground/40 hover:text-foreground transition-colors" />
              <LanguageSwitcher />
              <div className="flex items-center gap-4 text-xs text-foreground/40">
                <Link
                  href="/privacy"
                  className="hover:text-accent transition-colors duration-200 flex items-center gap-1"
                >
                  {privacyLabel}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <span className="text-foreground/10" aria-hidden>|</span>
                <Link
                  href="/terms"
                  className="hover:text-accent transition-colors duration-200 flex items-center gap-1"
                >
                  {termsLabel}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
