import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Coins, ShoppingCart, History, Sparkles, TrendingUp, ShieldCheck, Zap, Gift, Loader2, ExternalLink } from "lucide-react";
import { CREDITS, CREDIT_PACKS } from "@/credits";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function fmtCurrency(value: number) {
  return new Intl.NumberFormat("ar-TN", { style: "currency", currency: "TND", maximumFractionDigits: 2 }).format(value || 0);
}

function fmtNumber(value: number) {
  return new Intl.NumberFormat("ar-TN").format(value || 0);
}

export default function Subscription() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const { data: creditsData, isLoading } = trpc.credits.summary.useQuery();
  const { data: gateways } = trpc.credits.gateways.useQuery();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (packId: string, gateway: "flouci" | "d17") => {
    setPurchasing(packId);
    try {
      const result = await trpc.credits.startCheckout.mutate({
        packId: packId as "starter" | "standard" | "growth" | "business",
        gateway,
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("common.error");
      toast.error(message);
    } finally {
      setPurchasing(null);
    }
  };

  const balance = creditsData?.balance ?? 0;
  const history = creditsData?.history ?? [];

  const stats = useMemo(() => [
    { label: t("subscription.balance"), value: fmtNumber(balance), icon: Coins, color: "from-emerald-500 to-emerald-600" },
    { label: t("subscription.phoneCheck"), value: `${CREDITS.CHECK_PHONE} ${t("common.credits")}`, icon: Zap, color: "from-blue-500 to-blue-600" },
    { label: t("subscription.refreshCheck"), value: `${CREDITS.REFRESH_PHONE} ${t("common.credits")}`, icon: History, color: "from-amber-500 to-amber-600" },
    { label: t("subscription.signupBonus"), value: `+${CREDITS.FREE_TRIAL}`, icon: Gift, color: "from-violet-500 to-violet-600" },
  ], [balance, t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("subscription.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("subscription.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-0 overflow-hidden shadow-sm dark:bg-card">
            <div className={cn("h-1 bg-gradient-to-r", s.color)} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                <div className={cn("p-2 rounded-lg text-white bg-gradient-to-br", s.color)}><s.icon className="w-4 h-4" /></div>
              </div>
              <div className="text-xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Credit Packs */}
      <Card className="shadow-sm border-0 dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-emerald-500" />{t("subscription.packs")}</CardTitle>
          <CardDescription>{t("subscription.choosePack")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREDIT_PACKS.map(pack => (
              <Card key={pack.id} className={cn("border-2 transition-all hover:shadow-md", pack.highlighted ? "border-emerald-400 shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-600" : "border-border")}>
                <CardContent className="p-5 text-center">
                  {pack.highlighted && <Badge className="mb-3 bg-emerald-500">{t("common.save")}</Badge>}
                  <p className="font-bold text-lg text-foreground">{t(pack.nameKey)}</p>
                  <p className="text-3xl font-black text-foreground mt-2">{fmtCurrency(pack.priceTND)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{pack.credits} {t("common.credits")}</p>
                  <p className="text-xs text-muted-foreground mt-2">{(pack.priceTND / (pack.credits + Math.floor((pack.credits * pack.bonusPercent) / 100))).toFixed(3)} {t("orders.currencyTnd")}/{t("common.credits")}</p>
                  {pack.bonusPercent > 0 && <Badge variant="secondary" className="mt-3">+{pack.bonusPercent}% {t("subscription.bonus")}</Badge>}
                  <div className="flex flex-col gap-2 pt-2">
                    {gateways?.flouci && (
                      <Button
                        size="sm"
                        disabled={purchasing === pack.id}
                        onClick={() => handlePurchase(pack.id, "flouci")}
                      >
                        {purchasing === pack.id ? (
                          <Loader2 className="w-4 h-4 animate-spin me-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 me-2" />
                        )}
                        {t("subscription.upgrade")}
                      </Button>
                    )}
                    {gateways?.d17 && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={purchasing === pack.id}
                        onClick={() => handlePurchase(pack.id, "d17")}
                      >
                        {purchasing === pack.id ? (
                          <Loader2 className="w-4 h-4 animate-spin me-2" />
                        ) : (
                          <ExternalLink className="w-4 h-4 me-2" />
                        )}
                        {t("credits.buyWithD17")}
                      </Button>
                    )}
                    {!gateways?.flouci && !gateways?.d17 && (
                      <Button
                        onClick={() => setLocation("/credits")}
                        variant={pack.highlighted ? "default" : "outline"}
                      >
                        {t("subscription.upgrade")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="shadow-sm border-0 dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-blue-500" />{t("subscription.billingHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("subscription.noHistory")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/30">
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("orders.date")}</th>
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("common.credits")}</th>
                  <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t("subscription.statement")}</th>
                </tr></thead>
                <tbody>
                  {history.slice(0, 10).map((h: { date: string; amount: number; reason: string }, i: number) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 text-muted-foreground">{new Date(h.date).toLocaleDateString("ar-TN")}</td>
                      <td className={cn("py-3 px-4 font-semibold", h.amount > 0 ? "text-emerald-600" : "text-foreground")}>{h.amount > 0 ? "+" : ""}{h.amount}</td>
                      <td className="py-3 px-4 text-muted-foreground">{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
