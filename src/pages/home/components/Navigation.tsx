import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function Navigation() {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const nav = content?.nav;
  const sectionLinks = nav?.sectionLinks ?? [
    { id: "problem", label: "المشكلة" },
    { id: "solution", label: "الحل" },
    { id: "how-it-works", label: "كيف يعمل" },
    { id: "roadmap", label: "الأفكار القادمة" },
    { id: "contact", label: "تواصل" },
  ];
  const brandName = nav?.brandName ?? "Tunisia Trust Engine";
  const brandTagline = nav?.brandTagline ?? "AI-Powered Risk Scoring";
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const goToSection = (sectionId: string) => {
    if (location !== "/") {
      setLocation(`/#${sectionId}`);
      return;
    }

    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!location.startsWith("/#")) {
      return;
    }

    const sectionId = location.slice(2);
    requestAnimationFrame(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location]);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          <button
            onClick={() =>
              location === "/"
                ? window.scrollTo({ top: 0, behavior: "smooth" })
                : setLocation("/")
            }
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-right" dir="rtl">
              <div className="font-black text-lg md:text-xl text-slate-900 leading-tight">
                {brandName}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {brandTagline}
              </div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1" dir="rtl">
            {sectionLinks.map(link => (
              <button
                key={link.id}
                onClick={() => goToSection(link.id)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1" dir="rtl">
            <button
              onClick={() => setLocation("/plugins")}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
            >
              الإضافات
            </button>
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                className="mr-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                لوحة التحكم
              </Button>
            ) : (
              <div className="flex items-center gap-2 mr-2">
                <Button
                  onClick={() => setLocation("/login")}
                  variant="outline"
                  className="px-5 py-2 font-semibold rounded-lg border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => setLocation("/register")}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  إنشاء حساب
                </Button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2.5 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-2" dir="rtl">
            {sectionLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  goToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setLocation("/plugins");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-right px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
            >
              الإضافات
            </button>
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  setLocation("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 font-semibold rounded-lg shadow-md mt-2"
              >
                لوحة التحكم
              </Button>
            ) : (
              <div className="space-y-2 mt-2">
                <Button
                  onClick={() => {
                    setLocation("/login");
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-50 py-3 font-semibold rounded-lg"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => {
                    setLocation("/register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 font-semibold rounded-lg shadow-md"
                >
                  إنشاء حساب
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
