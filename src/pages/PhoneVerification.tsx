import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Coins,
  History,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Globe,
  MessageCircle,
  Puzzle,
  UserCheck,
} from "lucide-react";
import { useLocation } from "wouter";
import { CREDITS } from "@/credits";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { cn } from "@/lib/utils";

function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-emerald-600 dark:text-emerald-400";
    case "medium":
      return "text-amber-600 dark:text-amber-400";
    case "high":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
}

function getRiskBorder(level: string): string {
  switch (level) {
    case "low":
      return "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20";
    case "medium":
      return "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20";
    case "high":
      return "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20";
    default:
      return "border-border bg-muted/50";
  }
}

interface HistoryEntry {
  id: string;
  phoneNumber: string;
  trustScore: number;
  riskLevel: string;
  creditsSpent: number;
  date: string;
}

export default function PhoneVerification() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsOtp, setSmsOtp] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);

  const creditsQuery = trpc.credits.summary.useQuery();
  const smsCfg = trpc.phoneVerification.smsConfigured.useQuery();
  const historyQuery = trpc.phoneVerification.history.useQuery();

  const verifyMutation = trpc.phoneVerification.verifyPhone.useMutation({
    onSuccess: () => {
      toast.success(t("phone.verifySuccess"));
      void creditsQuery.refetch();
      void historyQuery.refetch();
    },
    onError: (err: any) => {
      if (err instanceof TRPCClientError && err.message === "Insufficient credits") {
        toast.error(t("phone.insufficientCredits"));
        return;
      }
      toast.error(err.message ?? t("common.error"));
    },
  });

  const requestSmsOtp = trpc.phoneVerification.requestSmsOtp.useMutation({
    onSuccess: () => toast.success(t("phone.otpSent")),
    onError: (err: any) => toast.error(err.message ?? t("common.error")),
  });

  const confirmSmsOtp = trpc.phoneVerification.confirmSmsOtp.useMutation({
    onSuccess: () => toast.success(t("phone.otpConfirmed")),
    onError: (err: any) => toast.error(err.message ?? t("common.error")),
  });

  const creditsBalance = creditsQuery.data?.balance ?? 0;
  const result = verifyMutation.data ?? null;
  const isChecking = verifyMutation.isPending;
  const canCheck = creditsBalance >= CREDITS.CHECK_PHONE;
  const isLowBalance = creditsBalance < CREDITS.LOW_BALANCE_THRESHOLD;
  const history: HistoryEntry[] = historyQuery.data ?? [];
  const isLoadingHistory = historyQuery.isLoading;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = phoneNumber.trim();
    if (!trimmed) {
      toast.error(t("phone.enterNumber"));
      return;
    }
    if (trimmed.length < 8) {
      toast.error(t("phone.invalidNumber"));
      return;
    }
    if (!canCheck) {
      toast.error(t("phone.insufficientCredits"));
      return;
    }
    verifyMutation.mutate({ phoneNumber: trimmed });
  };

  const gaugeRadius = 60;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const score = result?.trustScore ?? 0;
  const gaugeOffset = gaugeCircumference * (1 - score / 100);

  return (
    <div dir={dir}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("phone.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("phone.subtitle")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("phone.verifyNumber")}</CardTitle>
                <CardDescription>
                  {t("phone.checkCost")} {CREDITS.CHECK_PHONE} {t("common.credits")} &middot;{" "}
                  {t("phone.refreshCost")} {CREDITS.REFRESH_PHONE} {t("common.credits")}
                </CardDescription>
                <div className="mt-3 flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">{t("phone.creditsBalance")}</span>
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Coins className="h-4 w-4 text-primary" />
                    {creditsBalance}
                  </span>
                </div>
                {isLowBalance && (
                  <Alert className="mt-3 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">
                      {t("phone.lowBalance")}
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      <button
                        type="button"
                        className="underline font-medium"
                        onClick={() => setLocation("/pricing")}
                      >
                        {t("phone.buyCredits")}
                      </button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone.input")}</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 pe-2 text-sm text-muted-foreground font-mono border-e border-border bg-muted/50 rounded-l-md">
                        +216
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        dir="ltr"
                        className="pl-16 pe-14 dark:bg-muted/60"
                        placeholder="XX XXX XXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isChecking || !canCheck} className="w-full dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
                    {isChecking ? (
                      <>{t("phone.checking")}...</>
                    ) : canCheck ? (
                      <>{t("phone.check")} (&minus;{CREDITS.CHECK_PHONE})</>
                    ) : (
                      t("phone.insufficientCredits")
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {smsCfg.data?.twilio && (
              <Card>
                <CardHeader className="cursor-pointer select-none" onClick={() => setOtpOpen(!otpOpen)}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t("phone.otpTitle")}</CardTitle>
                    <Button variant="ghost" size="icon" type="button" tabIndex={-1}>
                      {otpOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <CardDescription>{t("phone.otpDescription")}</CardDescription>
                </CardHeader>
                {otpOpen && (
                  <CardContent className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={requestSmsOtp.isPending || !phoneNumber.trim()}
                      onClick={() => requestSmsOtp.mutate({ phone: phoneNumber.trim() })}
                    >
                      {requestSmsOtp.isPending ? t("common.sending") : t("phone.otpSend")}
                    </Button>
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="min-w-[140px] flex-1 space-y-1">
                        <Label htmlFor="sms-otp">{t("phone.otpInput")}</Label>
                        <Input
                          id="sms-otp"
                          inputMode="numeric"
                          maxLength={6}
                          value={smsOtp}
                          onChange={(e) => setSmsOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        />
                      </div>
                      <Button
                        type="button"
                        disabled={confirmSmsOtp.isPending || smsOtp.length !== 6 || !phoneNumber.trim()}
                        onClick={() =>
                          confirmSmsOtp.mutate({
                            phone: phoneNumber.trim(),
                            code: smsOtp,
                          })
                        }
                      >
                        {t("phone.otpConfirm")}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{t("phone.history")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <History className="mb-3 h-10 w-10 text-muted-foreground/50" />
                    <p className="text-muted-foreground">{t("phone.noHistory")}</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">{t("phone.noHistoryHint")}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 text-start font-medium">{t("orders.phone")}</th>
                          <th className="px-3 py-2 text-start font-medium">{t("phone.trustScore")}</th>
                          <th className="px-3 py-2 text-start font-medium">{t("phone.riskLevel")}</th>
                          <th className="px-3 py-2 text-start font-medium">{t("common.credits")}</th>
                          <th className="px-3 py-2 text-start font-medium">{t("orders.date")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((entry) => (
                          <tr
                            key={entry.id}
                            className="border-b last:border-0 hover:bg-muted/50"
                          >
                            <td className="px-3 py-2.5 font-mono text-foreground text-end" dir="ltr">
                              {entry.phoneNumber}
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={cn(
                                  "font-semibold",
                                  entry.trustScore >= 70
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : entry.trustScore >= 40
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-red-600 dark:text-red-400",
                                )}
                              >
                                {entry.trustScore}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <Badge
                                variant={
                                  entry.riskLevel === "low"
                                    ? "default"
                                    : entry.riskLevel === "high"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {entry.riskLevel === "low" && t("phone.riskLow")}
                                {entry.riskLevel === "medium" && t("phone.riskMedium")}
                                {entry.riskLevel === "high" && t("phone.riskHigh")}
                              </Badge>
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground">
                              {entry.creditsSpent}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString(
                                dir === "rtl" ? "ar-TN" : "en-US",
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {isChecking ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center py-10">
                    <Skeleton className="h-36 w-36 rounded-full" />
                    <Skeleton className="mt-4 h-6 w-28" />
                    <Skeleton className="mt-2 h-4 w-36" />
                    <Skeleton className="mt-2 h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ) : result ? (
              <Card className={cn("border-2", getRiskBorder(result.riskLevel))}>
                <CardHeader>
                  <CardTitle className="text-lg">{t("phone.result")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative flex items-center justify-center">
                    <svg
                      width="150"
                      height="150"
                      viewBox="0 0 150 150"
                      className="transform -rotate-90"
                    >
                      <circle
                        cx="75"
                        cy="75"
                        r={gaugeRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted"
                      />
                      <circle
                        cx="75"
                        cy="75"
                        r={gaugeRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={gaugeCircumference}
                        strokeDashoffset={gaugeOffset}
                        className={cn(
                          "transition-all duration-700",
                          score >= 70
                            ? "text-emerald-500 dark:text-emerald-400"
                            : score >= 40
                              ? "text-amber-500 dark:text-amber-400"
                              : "text-red-500 dark:text-red-400",
                        )}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{score}</span>
                      <span className="text-xs text-muted-foreground">{t("phone.trustScore")}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.phone")}</p>
                    <p className="font-mono font-medium text-foreground">{result.phoneNumber}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("phone.riskLevel")}</p>
                    <p className={cn("text-lg font-semibold capitalize", getRiskColor(result.riskLevel))}>
                      {result.riskLevel === "low" && t("phone.riskLow")}
                      {result.riskLevel === "medium" && t("phone.riskMedium")}
                      {result.riskLevel === "high" && t("phone.riskHigh")}
                    </p>
                  </div>

                  <div className="space-y-2 rounded-lg border bg-card p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("phone.successfulOrders")}
                      </span>
                      <span className="font-semibold text-foreground">
                        {result.successfulOrders}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t("phone.rtoCount")}</span>
                      <span className="font-semibold text-foreground">{result.rtoCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("phone.creditsSpent")}</span>
                      <span className="font-medium text-foreground">
                        {result.creditsSpent} {t("common.credits")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border bg-card p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("phone.dataSources")}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {t("phone.scoreFromSources")}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        {
                          key: "api",
                          label: t("phone.sourceApi"),
                          icon: Globe,
                          count: result.scoreSources?.api ?? 0,
                        },
                        {
                          key: "messenger",
                          label: t("phone.sourceMessenger"),
                          icon: MessageCircle,
                          count: result.scoreSources?.messenger ?? 0,
                        },
                        {
                          key: "plugin",
                          label: t("phone.sourcePlugin"),
                          icon: Puzzle,
                          count: result.scoreSources?.plugin ?? 0,
                        },
                        {
                          key: "manual",
                          label: t("phone.sourceManual"),
                          icon: UserCheck,
                          count: result.scoreSources?.manual ?? 0,
                        },
                      ].map((s) => {
                        const Icon = s.icon;
                        const hasData = s.count > 0;
                        return (
                          <div
                            key={s.key}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                              hasData
                                ? "bg-primary/10 text-primary"
                                : "bg-muted/50 text-muted-foreground/50",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{s.label}</span>
                            {hasData && (
                              <span className="ms-auto font-medium tabular-nums">
                                {s.count}
                              </span>
                            )}
                            {!hasData && (
                              <span className="ms-auto text-[10px]">
                                &mdash;
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex items-start gap-2 rounded-lg border p-3 text-sm font-medium",
                      getRiskBorder(result.riskLevel),
                    )}
                  >
                    {result.riskLevel === "low" && (
                      <>
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{t("phone.recommendationLow")}</span>
                      </>
                    )}
                    {result.riskLevel === "medium" && (
                      <>
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>{t("phone.recommendationMedium")}</span>
                      </>
                    )}
                    {result.riskLevel === "high" && (
                      <>
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>{t("phone.recommendationHigh")}</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center py-12 text-center">
                    <Phone className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">{t("phone.noResult")}</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {t("phone.noResultHint")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
