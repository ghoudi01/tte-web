import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export function Footer() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const footer = content?.footer;
  const brandName = footer?.brandName ?? "Tunisia Trust Engine";
  const tagline = footer?.tagline ?? "AI-Powered Risk Scoring";
  const description = footer?.description ?? "نظام ذكاء اصطناعي متقدم لتقليل معدلات الارتجاع في التجارة الإلكترونية التونسية.";
  const email = footer?.email ?? "info@tunisiatrustengine.tn";
  const phone = footer?.phone ?? "+21612345678";
  const location = footer?.location ?? "تونس";
  const productLinks = footer?.productLinks ?? [
    { label: "الحل", targetId: "solution" },
    { label: "كيف يعمل", targetId: "how-it-works" },
    { label: "الفوائد", targetId: "benefits" },
  ];
  const companyLinks = footer?.companyLinks ?? [
    { label: "المشكلة", targetId: "problem" },
    { label: "عن المشروع", targetId: "" },
    { label: "الأخبار", targetId: "" },
    { label: "اتصل بنا", targetId: "contact" },
  ];
  const copyright = footer?.copyright ?? "© 2026 Tunisia Trust Engine. جميع الحقوق محفوظة.";
  const privacyLabel = footer?.privacyLabel ?? "سياسة الخصوصية";
  const termsLabel = footer?.termsLabel ?? "شروط الاستخدام";

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          <div className="lg:col-span-2" dir="rtl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="font-black text-xl md:text-2xl mb-1">{brandName}</div>
                <div className="text-xs md:text-sm text-slate-400">{tagline}</div>
              </div>
            </div>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-lg mb-6">
              {description}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href={`mailto:${email}`} 
                className="w-12 h-12 bg-slate-800 hover:bg-teal-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href={`tel:${phone.replace(/\s/g, "")}`} 
                className="w-12 h-12 bg-slate-800 hover:bg-teal-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400 px-4 py-2 bg-slate-800 rounded-xl">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div dir="rtl">
            <h4 className="font-bold text-white mb-5 text-lg">المنتج</h4>
            <ul className="space-y-3">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <button 
                    onClick={() => link.targetId && document.getElementById(link.targetId)?.scrollIntoView({ behavior: "smooth" })} 
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-teal-400 transition-colors"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div dir="rtl">
            <h4 className="font-bold text-white mb-5 text-lg">الشركة</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <button 
                    onClick={() => link.targetId && document.getElementById(link.targetId)?.scrollIntoView({ behavior: "smooth" })} 
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-teal-400 transition-colors"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4" dir="rtl">
            <p className="text-sm text-slate-400 text-center md:text-right">
              {copyright}
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-teal-400 transition-colors duration-200">
                {privacyLabel}
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/terms" className="hover:text-teal-400 transition-colors duration-200">
                {termsLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

