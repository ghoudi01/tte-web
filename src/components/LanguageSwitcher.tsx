import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import type { Lang } from "@/lib/i18n";

const LANG_LABELS: Record<Lang, string> = { ar: "العربية", fr: "Français", en: "English" };
const LANG_FLAGS: Record<Lang, string> = { ar: "🇹🇳", fr: "🇫🇷", en: "🇬🇧" };

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, dir } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-1 px-2 rounded-lg ${className ?? ""}`}>
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">{LANG_LABELS[lang]}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-36">
        {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className={`cursor-pointer ${lang === l ? "font-bold bg-accent/20" : ""}`}
          >
            {LANG_FLAGS[l]} {LANG_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
