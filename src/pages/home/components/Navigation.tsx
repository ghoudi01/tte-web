import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { YakeenLogo } from "@/components/YakeenLogo";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function Navigation({ solid }: { solid?: boolean }) {
  const { data: content } = trpc.automation.getHomeContent.useQuery();
  const { t, dir } = useLanguage();
  const nav = content?.nav;
  const brandName = nav?.brandName ?? t("nav.brand");
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid || scrolled
          ? `${solid ? "bg-background" : "bg-background/80 backdrop-blur-xl"} border-b border-border/40 shadow-lg shadow-black/5`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() =>
              location === "/"
                ? window.scrollTo({ top: 0, behavior: "smooth" })
                : setLocation("/")
            }
            className="flex items-center gap-4 group"
          >
            <YakeenLogo size={48} showText />
          </button>
          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle className="text-muted-foreground/70 hover:text-foreground transition-colors" />
            <LanguageSwitcher />
            <div className="w-px h-5 bg-border/50 mx-1 md:mx-2" />
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation("/dashboard")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-5 h-9 text-xs md:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <LayoutDashboard className="w-3.5 h-3.5 md:w-4 md:h-4 me-1.5" />
                {t("nav.dashboard")}
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-2">
                  <Button
                    onClick={() => setLocation("/login")}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-border/30 px-3 md:px-4 h-9 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200"
                  >
                  <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 me-1.5 md:me-2" />
                  {t("nav.login")}
                </Button>
                <Button
                  onClick={() => setLocation("/register")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-5 h-9 text-xs md:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4 me-1.5 md:me-2" />
                  {t("nav.register")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
