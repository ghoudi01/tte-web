import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2,
  Link2,
  Trash2,
  MessageCircle,
  ShoppingBag,
  MessageSquare,
  Package,
  AlertCircle,
  CheckCircle2,
  Power,
  BarChart3,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

function apiOriginForMetaOAuth(): string {
  const v = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!v) return "";
  try {
    const url = v.startsWith("http") ? v : `https://${v}`;
    return new URL(url).origin;
  } catch {
    return "";
  }
}

export default function SocialSellersDashboard({ embedded = false }: { embedded?: boolean }) {
  const { t, dir } = useLanguage();
  const metaCrypto = trpc.socialSellers.metaCryptoConfigured.useQuery();
  const connections = trpc.socialSellers.connections.useQuery();
  const botStatus = trpc.socialSellers.botStatus.useQuery();
  const botStats = trpc.socialSellers.botStats.useQuery();
  const utils = trpc.useUtils();

  const toggleBotMut = trpc.socialSellers.botToggle.useMutation({
    onSuccess: async () => {
      await utils.socialSellers.botStatus.invalidate();
      await utils.socialSellers.botStats.invalidate();
    },
    onError: (err) => toast.error(err.message ?? t("common.error")),
  });

  const deleteConn = trpc.socialSellers.deleteMetaConnection.useMutation({
    onSuccess: async () => {
      toast.success(t("socialSellers.deleteSuccess"));
      await utils.socialSellers.connections.invalidate();
      await utils.socialSellers.botStatus.invalidate();
      await utils.socialSellers.botStats.invalidate();
    },
    onError: (err) => toast.error(err.message ?? t("common.error")),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("meta");
    if (m === "connected") toast.success(t("socialSellers.connectedToast"));
    else if (m === "error" || m === "token" || m === "exception")
      toast.error(t("socialSellers.errorToast"));
    else if (m === "nopages") toast.message(t("socialSellers.noPagesToast"));
    if (m) {
      const url = new URL(window.location.href);
      url.searchParams.delete("meta");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [t]);

  const connectHref = (() => {
    const origin = apiOriginForMetaOAuth();
    const path = "/api/meta/page/start";
    return origin ? `${origin}${path}` : path;
  })();

  const hasConnection = (connections.data?.length ?? 0) > 0;
  const botIsOn = botStatus.data?.enabled ?? false;
  const isConnected = botStatus.data?.connected ?? false;
  const loading = metaCrypto.isLoading || botStatus.isLoading || botStats.isLoading;

  const stats = [
    {
      key: "orders",
      icon: ShoppingBag,
      label: t("socialSellers.botOrders7d"),
      value: botStats.data?.orders7d ?? 0,
    },
    {
      key: "conversations",
      icon: MessageSquare,
      label: t("socialSellers.botConversations7d"),
      value: botStats.data?.conversations7d ?? 0,
    },
    {
      key: "total",
      icon: Package,
      label: t("socialSellers.botProductsTotal"),
      value: botStats.data?.totalProducts ?? 0,
    },
    {
      key: "enabled",
      icon: CheckCircle2,
      label: t("socialSellers.botProductsEnabled"),
      value: botStats.data?.enabledProducts ?? 0,
    },
  ];

  if (embedded) {
    return (
      <div className="space-y-4">
        {!hasConnection && (
          <Button asChild disabled={!metaCrypto.data?.configured}>
            <a href={connectHref}>{t("socialSellers.connectButton")}</a>
          </Button>
        )}
        <ul className="text-sm text-muted-foreground space-y-2">
          {(connections.data ?? []).map((c: { id: string; facebookPageId: string; instagramBusinessAccountId?: string }) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 border bg-card rounded-lg px-3 py-2">
              <span>
                {t("socialSellers.pageLabel")} <span className="font-mono text-xs">{c.facebookPageId}</span>
                {c.instagramBusinessAccountId && (
                  <> · {t("socialSellers.instagramLabel")} <span className="font-mono text-xs">{c.instagramBusinessAccountId}</span></>
                )}
              </span>
              <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => deleteConn.mutate({ connectionId: c.id })} disabled={deleteConn.isPending}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
          {!hasConnection && (
            <li className="text-muted-foreground">{t("socialSellers.noConnections")}</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8" dir={dir}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("socialSellers.title")}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">{t("socialSellers.desc3")}</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : (
        <>
          {/* Bot Toggle Card */}
          <Card className={cn("border-2 transition-colors", botIsOn ? "border-emerald-200 dark:border-emerald-800" : "border-muted")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    botIsOn ? "bg-emerald-100 dark:bg-emerald-900/50" : "bg-muted",
                  )}>
                    <MessageCircle className={cn(
                      "w-6 h-6",
                      botIsOn ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t("socialSellers.botTitle")}</CardTitle>
                    <CardDescription>{t("socialSellers.botDesc")}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-sm font-medium",
                    botIsOn ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                  )}>
                    {botIsOn ? t("socialSellers.botEnabled") : t("socialSellers.botDisabled")}
                  </span>
                  <Switch
                    checked={botIsOn}
                    disabled={toggleBotMut.isPending || !isConnected}
                    onCheckedChange={(checked) => toggleBotMut.mutate({ enabled: checked })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Connection Status */}
              <div className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-3 text-sm",
                isConnected
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
              )}>
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>
                  {isConnected
                    ? `✅ متصل بصفحة: ${botStatus.data?.pageName ?? "—"}`
                    : `⚠️ ${t("socialSellers.botNotConnected")}`
                  }
                </span>
              </div>

              {/* Product Warning */}
              {botIsOn && botStats.data && botStats.data.enabledProducts === 0 && botStats.data.totalProducts > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{t("socialSellers.botNeedProducts")}</span>
                </div>
              )}

              {/* Stats Grid */}
              {botIsOn && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.key} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                          <p className="text-lg font-bold text-foreground">{s.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Page Connection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="w-5 h-5" />
                {t("socialSellers.connectCard")}
              </CardTitle>
              <CardDescription>{t("socialSellers.connectDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {!hasConnection && (
                  <Button asChild disabled={!metaCrypto.data?.configured}>
                    <a href={connectHref}>{t("socialSellers.connectButton")}</a>
                  </Button>
                )}
                {hasConnection && (
                  <Button
                    variant="outline"
                    onClick={() => toggleBotMut.mutate({ enabled: !botIsOn })}
                    disabled={toggleBotMut.isPending}
                    className="gap-2"
                  >
                    <Power className="w-4 h-4" />
                    {botIsOn ? t("socialSellers.botOff") : t("socialSellers.botOn")}
                  </Button>
                )}
              </div>

              <ul className="text-sm text-muted-foreground space-y-2">
                {(connections.data ?? []).map((c: {
                  id: string;
                  facebookPageId: string;
                  instagramBusinessAccountId?: string;
                  tokenExpiresAt?: string;
                }) => {
                  const isExpiringSoon = c.tokenExpiresAt && new Date(c.tokenExpiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;
                  const isExpired = c.tokenExpiresAt && new Date(c.tokenExpiresAt).getTime() < Date.now();
                  return (
                    <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 border bg-card rounded-lg px-3 py-2">
                      <div className="space-y-1">
                        <span>
                          {t("socialSellers.pageLabel")} <span className="font-mono text-xs">{c.facebookPageId}</span>
                          {c.instagramBusinessAccountId && (
                            <> · {t("socialSellers.instagramLabel")} <span className="font-mono text-xs">{c.instagramBusinessAccountId}</span></>
                          )}
                        </span>
                        {isExpired && <p className="text-xs text-red-600 dark:text-red-400">انتهت صلاحية التوقيع — يرجى إعادة الربط</p>}
                        {isExpiringSoon && !isExpired && <p className="text-xs text-amber-600 dark:text-amber-400">تنتهي صلاحية التوقيع قريباً — يُنصح بإعادة الربط</p>}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => deleteConn.mutate({ connectionId: c.id })}
                        disabled={deleteConn.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  );
                })}
                {!hasConnection && (
                  <li className="text-muted-foreground">{t("socialSellers.noConnections")}</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Info Card */}
          {botIsOn && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5" />
                  {t("socialSellers.botFlowTitle")}
                </CardTitle>
                <CardDescription>{t("socialSellers.botFlowDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>🤖 <strong>كيف يعمل البوت الجديد:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 me-2">
                    <li>الزبون يرسل رسالة للصفحة (أو يكتب "مرحبا")</li>
                    <li>البوت يعرض: عرض المنتجات · بحث · حالة طلب</li>
                    <li>الزبون يتصفح التصنيفات ويختار منتجاً</li>
                    <li>يدخل رقم الهاتف، الاسم، المدينة</li>
                    <li>الطلب يظهر في قائمة طلباتك مع درجة الثقة</li>
                  </ol>
                  <p className="pt-2 text-xs">
                    💡 تأكد من إضافة منتجاتك في صفحة "المنتجات" وتفعيل خيار "عرض في البوت" لكل منتج.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
