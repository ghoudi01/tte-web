import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

type YakeenLogoProps = {
  size?: number;
  showText?: boolean;
  compact?: boolean;
  className?: string;
};

export function YakeenLogo({ size = 40, showText = false, compact = false, className = "" }: YakeenLogoProps) {
  const { t, dir } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`flex items-center gap-3 ${className}`} dir={dir}>
      <img
        src={theme === "dark" ? "/logo-light.png" : "/logo.png"}
        alt="Yakeen"
        width={size}
        height={size}
        style={{ flexShrink: 0 }}
      />
      {showText && (
          <div className="flex flex-col items-start">
            <span className={`font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#151A3B] via-[#0E7D8A] to-[#F78D3E] dark:from-[#E0E0E0] dark:via-[#0E7D8A] dark:to-[#F78D3E] ${compact ? "text-sm md:text-base" : "text-xl md:text-2xl lg:text-3xl"}`}>
              {t("nav.brand")}
            </span>
            <span className={`font-medium tracking-wide uppercase text-muted-foreground ${compact ? "text-[9px] md:text-[10px]" : "text-[10px] md:text-xs"}`}>
              {t("nav.tagline")}
            </span>
          </div>
      )}
    </div>
  );
}
