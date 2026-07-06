import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, History, SearchX } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

function formatDate(iso: string, locale = "ar-TN") {
  try {
    return new Date(iso).toLocaleString(locale, {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function RiskBadge({ level }: { level: string }) {
  const { t } = useLanguage();
  const cfg: Record<string, { label: string; class: string }> = {
    low: { label: t("phone.riskLow"), class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200" },
    medium: { label: t("phone.riskMedium"), class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200" },
    high: { label: t("phone.riskHigh"), class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200" },
    critical: { label: t("phone.riskCritical"), class: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200" },
  };
  const c = cfg[level] ?? { label: level, class: "" };
  return <Badge className={cn("border", c.class)}>{c.label}</Badge>;
}

export default function PhoneVerificationHistory() {
  const { t, dir } = useLanguage();
  const locale = dir === "rtl" ? "ar-TN" : "fr-TN";
  const { data: rows, isLoading } = trpc.phoneVerification.history.useQuery();
  const list = rows ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("phone.history")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("phone.verificationHistory")}</p>
      </div>
      <Card className="shadow-sm border-0 dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" />{t("phone.history")}</CardTitle>
          <CardDescription>{isLoading ? t("common.loading") : `${list.length} ${t("phone.checksCount")}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("orders.phone")}</th>
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("phone.trustScore")}</th>
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("phone.riskLevel")}</th>
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("orders.date")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {[...Array(4)].map((_, j) => <td key={j} className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>)}
                  </tr>
                )) : list.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">
                    <SearchX className="w-8 h-8 mx-auto mb-2" />{t("common.noData")}
                  </td></tr>
                ) : list.map((h: { id: string; phoneNumber: string; trustScore: number; riskLevel: string; date: string }) => (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm text-foreground text-end" dir="ltr">{h.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        h.trustScore >= 70 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                        h.trustScore >= 40 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300")}>
                        {h.trustScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4"><RiskBadge level={h.riskLevel} /></td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(h.date, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
