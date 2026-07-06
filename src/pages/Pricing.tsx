import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation } from "wouter";
import { Check, Coins, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { CREDIT_PACKS } from "@/credits";
import { AUTH_ME_QUERY_OPTS } from "@/constants/auth";
import { trpc } from "@/lib/trpc";

function fmtTND(value: number, lang: string) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-TN" : lang === "fr" ? "fr-TN" : "en-US", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value);
}

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { t, dir, lang } = useLanguage();
  const { data: sessionUser } = trpc.auth.me.useQuery(undefined, {
    ...AUTH_ME_QUERY_OPTS,
  });
  const { data: gateways } = trpc.credits.gateways.useQuery();
  const [gateway, setGateway] = useState<"flouci" | "d17">("flouci");

  useEffect(() => {
    if (!gateways) return;
    if (gateways.flouci) setGateway("flouci");
    else if (gateways.d17) setGateway("d17");
  }, [gateways]);

  const purchaseMutation = trpc.credits.purchasePack.useMutation({
    onSuccess: () => {
      toast.success(t("pricing.purchaseSuccess"));
      setLocation("/credits");
    },
    onError: (err: any) => toast.error(err.message ?? t("pricing.purchaseError")),
  });

  const startCheckout = trpc.credits.startCheckout.useMutation({
    onSuccess: (data: any) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (err: any) => toast.error(err.message ?? t("pricing.checkoutError")),
  });

  const checkoutAvailable = !!(gateways?.flouci || gateways?.d17);
  const paying = purchaseMutation.isPending || startCheckout.isPending;

  const handleBuyPack = (packId: (typeof CREDIT_PACKS)[number]["id"]) => {
    if (!sessionUser) {
      setLocation("/register");
      return;
    }
    if (checkoutAvailable) {
      const g =
        gateways?.flouci && gateways?.d17
          ? gateway
          : gateways?.flouci
            ? "flouci"
            : "d17";
      startCheckout.mutate({ packId, gateway: g });
      return;
    }
    if (gateways?.directPurchase) {
      purchaseMutation.mutate(packId);
      return;
    }
    toast.error(t("pricing.noGateway"));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 pb-12 pt-20 md:pt-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12" dir={dir}>
            <h1 className="text-4xl font-bold text-foreground mb-2">{t("pricing.title")}</h1>
            <p className="text-lg text-muted-foreground">
              {t("pricing.subtitle")}
            </p>
            {checkoutAvailable && gateways?.flouci && gateways?.d17 ? (
              <div className="mt-6 flex flex-col items-center gap-3 text-end max-w-md mx-auto">
                <Label className="text-muted-foreground">{t("pricing.gatewayLabel")}</Label>
                <RadioGroup
                  className="flex flex-row gap-6"
                  value={gateway}
                  onValueChange={v => setGateway(v as "flouci" | "d17")}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="flouci" id="gw-flouci" />
                    <Label htmlFor="gw-flouci" className="font-normal cursor-pointer">
                      Flouci
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="d17" id="gw-d17" />
                    <Label htmlFor="gw-d17" className="font-normal cursor-pointer">
                      {t("pricing.gatewayD17")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{t("credits.title")}</p>
                    <p className="text-sm text-muted-foreground">{t("credits.subtitle")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{t("pricing.instantVerification")}</p>
                    <p className="text-sm text-muted-foreground">{t("pricing.instantVerificationDesc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{t("pricing.creditsNeverExpire")}</p>
                    <p className="text-sm text-muted-foreground">{t("pricing.creditsNeverExpireDesc")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKS.map((pack) => {
              const totalCredits = pack.bonusPercent
                ? pack.credits + Math.floor((pack.credits * pack.bonusPercent) / 100)
                : pack.credits;
              return (
                <Card
                  key={pack.id}
                  className={pack.highlighted ? "border-2 border-primary shadow-lg" : ""}
                >
                  <CardHeader>
                    {pack.highlighted && (
                      <Badge className="w-fit mb-2">{t("pricing.mostPopular")}</Badge>
                    )}
                    <CardTitle className="text-xl">{t(pack.nameKey)}</CardTitle>
                    <CardDescription>{t(pack.descKey)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-card-foreground">{fmtTND(pack.priceTND, lang)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-card-foreground">{totalCredits}</span> {t("common.credits")}
                      {pack.bonusPercent ? (
                        <span className="text-emerald-600"> {t("pricing.bonusPercent").replace("{percent}", String(pack.bonusPercent))}</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("pricing.perCredit").replace("{price}", (pack.priceTND / (pack.credits + Math.floor((pack.credits * pack.bonusPercent) / 100))).toFixed(3))}
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        {t("pricing.phoneCheckDetail")}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        {t("pricing.refreshCheckDetail")}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent shrink-0" />
                        {t("pricing.neverExpire")}
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={paying}
                      onClick={() => handleBuyPack(pack.id)}
                    >
                      {paying && <Loader2 className="h-4 w-4 animate-spin me-1" />}
                      {sessionUser
                        ? checkoutAvailable
                          ? t("pricing.payGateway")
                          : gateways?.directPurchase
                            ? t("pricing.buyTrial")
                            : t("pricing.buyCredits")
                        : t("pricing.openAccount")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {t("pricing.subtitle")}
            {" — "}
            {t("pricing.gatewayLabel")}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
