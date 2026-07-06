import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link as LinkIcon, Users, BarChart3, Copy, Share2, Gift, TrendingUp, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

function fmtNumber(value: number, locale = "ar-TN") {
  return new Intl.NumberFormat(locale).format(value || 0);
}

export default function Referrals() {
  const { t, dir } = useLanguage();
  const locale = dir === "rtl" ? "ar-TN" : "fr-TN";
  const [location, setLocation] = useLocation();
  const { data, isLoading } = trpc.referrals.summary.useQuery();

  const tabFromPath = location === "/referrals/users" ? "users" : location === "/referrals/stats" ? "stats" : "link";
  const referralLink = typeof window !== "undefined" && data?.referralCode
    ? `${window.location.origin}/register?ref=${encodeURIComponent(data.referralCode)}`
    : "";

  const copyLink = () => {
    if (!referralLink) return;
    void navigator.clipboard.writeText(referralLink);
    toast.success(t("common.copied"));
  };

  const stats = useMemo(() => [
    { label: t("referrals.total"), value: fmtNumber(data?.totalReferrals ?? 0, locale), icon: Users, color: "from-blue-500 to-blue-600" },
    { label: t("referrals.earned"), value: `${fmtNumber(data?.creditsEarned ?? 0, locale)}`, icon: Gift, color: "from-emerald-500 to-emerald-600" },
    { label: t("referrals.conversion"), value: `${data?.conversionRate ?? 0}%`, icon: TrendingUp, color: "from-violet-500 to-violet-600" },
  ], [data, locale, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <div className="grid sm:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("referrals.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("referrals.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-0 overflow-hidden shadow-sm dark:bg-card">
            <div className={cn("h-1 bg-gradient-to-r", s.color)} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className={cn("p-2 rounded-lg text-white bg-gradient-to-br", s.color)}><s.icon className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referral Link */}
      <Card className="shadow-sm border-0 dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><LinkIcon className="w-4 h-4 text-emerald-500" />{t("referrals.shareLink")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 h-9 flex items-center px-3 rounded-lg bg-muted/50 border border-border font-mono text-sm text-foreground truncate" dir="ltr">
              {referralLink || (data?.referralCode ? `${window.location.origin}/register?ref=${data.referralCode}` : "-")}
            </div>
            <Button variant="outline" onClick={copyLink} className="shrink-0"><Copy className="w-4 h-4 ms-1" />{t("common.copy")}</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{t("referrals.shareDesc")}</p>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="shadow-sm border-0 dark:bg-card bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-emerald-500" />{t("referrals.howItWorks")}</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { step: "1", text: t("referrals.step1"), icon: Copy },
              { step: "2", text: t("referrals.step2"), icon: Share2 },
              { step: "3", text: t("referrals.step3"), icon: Gift },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-3 p-3 rounded-xl bg-card/60">
                <span className="flex w-8 h-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm">{item.step}</span>
                <span className="text-foreground/80">{item.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referred Users */}
      <Card className="shadow-sm border-0 dark:bg-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><UserPlus className="w-4 h-4 text-blue-500" />{t("referrals.referredUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          {(!data?.referredUsers || data.referredUsers.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("referrals.noReferrals")}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{data.referredUsers.length} {t("referrals.users")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
