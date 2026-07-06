import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import {
  Coins,
  ShoppingCart,
  History,
  Gift,
  TrendingUp,
  Phone,
  RefreshCw,
  FileText,
  Users,
  AlertCircle,
  ExternalLink,
  Loader2,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import {
  CREDITS,
  CREDIT_PACKS,
  CREDIT_REASON_LABELS,
  type CreditReason,
} from "@/credits";

export default function Credits() {
  const { t, dir, lang } = useLanguage();

  const fmtTND = (value: number) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-TN" : lang === "fr" ? "fr-TN" : "en-US", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(value);

  const fmtNumber = (value: number) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-TN" : "en-US").format(value);
  const [, setLocation] = useLocation();
  const search = useSearch();
  const utils = trpc.useUtils();

  const paymentParams = useMemo(() => {
    const q = search.startsWith("?") ? search.slice(1) : search;
    return new URLSearchParams(q);
  }, [search]);

  const paymentFlow = paymentParams.get("payment");
  const trackingId = paymentParams.get("tracking");

  const pollPayment = trpc.credits.pollPaymentStatus.useQuery(
    { trackingId: trackingId ?? "skip" },
    {
      enabled: !!trackingId && paymentFlow === "success",
      refetchInterval: (q: { state: { data?: { status?: string } } }) => {
        const st = q.state.data?.status;
        if (st === "completed" || st === "failed") return false;
        return 2500;
      },
    }
  );

  useEffect(() => {
    if (paymentFlow === "fail" && trackingId) {
      toast.error(t("credits.paymentFailed"));
      window.history.replaceState({}, "", "/credits");
    }
  }, [paymentFlow, trackingId, t]);

  useEffect(() => {
    if (pollPayment.data?.status !== "completed") return;
    toast.success(t("credits.paymentConfirmed"));
    void utils.credits.summary.invalidate();
    window.history.replaceState({}, "", "/credits");
  }, [pollPayment.data?.status, utils.credits.summary, t]);

  const creditsQuery = trpc.credits.summary.useQuery();
  const { data: gateways } = trpc.credits.gateways.useQuery();

  const [purchasing, setPurchasing] = useState<string | null>(null);

  const balance = creditsQuery.data?.balance ?? 0;
  const history = creditsQuery.data?.history ?? [];
  const isLowBalance = balance < CREDITS.LOW_BALANCE_THRESHOLD;

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
      const message = err instanceof Error ? err.message : t("credits.checkoutError");
      toast.error(message);
    } finally {
      setPurchasing(null);
    }
  };

  if (creditsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-40 rounded-xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (creditsQuery.error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("common.error")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("dashboard.retry")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("credits.title")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t("credits.subtitle")}</p>
      </div>

      {isLowBalance && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-200">{t("credits.lowBalance")}</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{t("credits.lowBalanceDesc")}</p>
            </div>
            <Button
              size="sm"
              onClick={() =>
                document.getElementById("credit-packs")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ShoppingCart className="w-4 h-4 ms-2" />
              {t("credits.buyNow")}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t("credits.yourBalance")}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <Coins className="w-8 h-8 text-emerald-200" />
                <span className="text-5xl font-bold">{fmtNumber(balance)}</span>
              </div>
              <p className="text-emerald-200 text-sm mt-1">{t("common.credits")}</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-1.5">
                {t("credits.checkCost", { cost: String(CREDITS.CHECK_PHONE) })}
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-1.5">
                {t("credits.refreshCost", { cost: String(CREDITS.REFRESH_PHONE) })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div id="credit-packs">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("credits.packs")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <Card
              key={pack.id}
              className={cn(
                "relative shadow-sm border overflow-hidden transition-all hover:shadow-md",
                pack.highlighted &&
                  "border-emerald-300 dark:border-emerald-600 ring-1 ring-emerald-300 dark:ring-emerald-600",
                "dark:bg-card"
              )}
            >
              {pack.highlighted && (
                <div className="absolute top-0 end-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {t("credits.bestValue")}
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">{t(pack.nameKey)}</CardTitle>
                <CardDescription>{t(pack.descKey)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-3xl font-bold text-foreground">
                    {fmtTND(pack.priceTND)}
                  </span>
                   <span className="text-sm text-muted-foreground me-1">
                    / {fmtNumber(pack.credits)} {t("common.credits")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {fmtTND(pack.priceTND / (pack.credits + Math.floor((pack.credits * pack.bonusPercent) / 100)))} / {t("credits.perCredit")}
                </div>
                {pack.bonusPercent > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                  >
                    +{pack.bonusPercent}% {t("credits.bonus")}
                  </Badge>
                )}
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
                      {t("credits.buyWithFlouci")}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="shadow-sm dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="w-4 h-4 text-blue-500" />
            {t("credits.transactionHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("credits.noHistory")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                      {t("credits.reason")}
                    </th>
                    <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                      {t("credits.amount")}
                    </th>
                    <th className="text-start py-3 px-4 font-medium text-muted-foreground">
                      {t("credits.date")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h: { id: string; type: string; amount: number; reason: string; date: string }) => (
                    <tr
                      key={h.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "p-1.5 rounded-full",
                              h.type === "earn"
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            )}
                          >
                            {h.type === "earn" ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <Coins className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">
                            {t(CREDIT_REASON_LABELS[h.reason as CreditReason]) ?? h.reason}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "font-semibold",
                            h.type === "earn"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-foreground"
                          )}
                        >
                          {h.type === "earn" ? "+" : "−"}
                          {fmtNumber(h.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(h.date).toLocaleDateString(dir === "rtl" ? "ar-TN" : "fr-TN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            {t("credits.howToEarn")}
          </CardTitle>
          <CardDescription>{t("credits.howToEarnDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="p-2 rounded-lg bg-emerald-500 text-white shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{t("credits.reportAccepted")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("credits.reportAcceptedDesc", { amount: String(CREDITS.REPORT_ACCEPTED) })}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setLocation("/reports/new")}
              >
                <Plus className="w-3.5 h-3.5 ms-1.5" />
                {t("credits.addReport")}
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
            <div className="p-2 rounded-lg bg-purple-500 text-white shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{t("credits.referrals")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("credits.referralsDesc", { amount: String(CREDITS.REFERRAL_FIRST_CHECK) })}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setLocation("/referrals")}
              >
                <ExternalLink className="w-3.5 h-3.5 ms-1.5" />
                {t("credits.referralLink")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
