import { useState, useMemo, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Copy, RefreshCw, Save, User, Settings2, Key, Facebook, Coins, Shield, AlertCircle, Eye, EyeOff, Download, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { AUTH_ME_QUERY_OPTS } from "@/constants/auth";
import { trpc } from "@/lib/trpc";
import SocialSellersDashboard from "./SocialSellersDashboard";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const search = useSearch();

  const tabConfig = useMemo(() => [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "automation", label: t("settings.automation"), icon: Settings2 },
    { id: "api", label: t("settings.api"), icon: Key },
    { id: "social", label: t("settings.social"), icon: Facebook },
    { id: "credits", label: t("settings.credits"), icon: Coins },
    { id: "security", label: t("settings.security"), icon: Shield },
  ], [t]);

  const activeTabSet = useMemo(() => new Set(tabConfig.map(t => t.id)), [tabConfig]);

  const meQuery = trpc.auth.me.useQuery(undefined, { ...AUTH_ME_QUERY_OPTS });
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const automationQuery = trpc.automation.getMerchantConfig.useQuery();
  const merchant = profileQuery.data ?? null;

  useEffect(() => {
    if (profileQuery.isSuccess && merchant === null) setLocation("/merchant-setup");
  }, [profileQuery.isSuccess, merchant, setLocation]);

  const activeTab = useMemo(() => {
    if (!search) return "profile";
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    const tab = params.get("tab") || "profile";
    if (["api", "credits", "automation", "security", "social"].includes(tab)) return tab;
    return "profile";
  }, [search]);

  const [formData, setFormData] = useState({ displayName: "", businessName: "", email: "", phone: "", contactMobile: "", city: "", address: "" });
  const [automationForm, setAutomationForm] = useState({ autoValidationEnabled: true, whatsappValidationEnabled: true, autoShippingSelectionEnabled: true, trustThresholdForDeposit: 40, defaultShippingCompany: "Rapid-Poste" });

  useEffect(() => {
    if (merchant) setFormData(p => ({ ...p, businessName: merchant.businessName ?? "", email: merchant.email ?? "", phone: merchant.phone ?? "", contactMobile: merchant.contactMobile ?? "", city: merchant.city ?? "", address: merchant.address ?? "" }));
  }, [merchant]);
  useEffect(() => { if (meQuery.data) setFormData(p => ({ ...p, displayName: meQuery.data.displayName ?? "" })); }, [meQuery.data]);
  useEffect(() => { if (automationQuery.data) setAutomationForm(automationQuery.data); }, [automationQuery.data]);

  const updateMutation = trpc.merchants.update.useMutation({ onError: (err: { message?: string }) => toast.error(err.message || t("common.error")) });
  const updateProfileMutation = trpc.auth.updateProfile.useMutation({ onError: (err: { message?: string }) => toast.error(err.message || t("common.error")) });
  const automationMutation = trpc.automation.updateMerchantConfig.useMutation({
    onSuccess: () => { automationQuery.refetch(); toast.success(t("settings.saved")); },
    onError: (err: { message?: string }) => toast.error(err.message || t("common.error")),
  });
  const resendVerifyMutation = trpc.auth.resendVerification.useMutation({
    onSuccess: () => {
      toast.success(t("common.success"));
      void meQuery.refetch();
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? t("common.error")),
  });
  const apiUsageQuery = trpc.merchants.apiUsage.useQuery(undefined, { enabled: activeTab === "security" });
  const loginHistoryQuery = trpc.merchants.loginHistory.useQuery(undefined, { enabled: activeTab === "security" });
  const notificationsQuery = trpc.notifications.list.useQuery(undefined, { enabled: activeTab === "security" });
  const markReadMutation = trpc.notifications.markRead.useMutation({ onSuccess: () => { void notificationsQuery.refetch(); void meQuery.refetch(); } });
  const regenerateMutation = trpc.merchants.regenerateApiKey.useMutation({ onSuccess: () => { void profileQuery.refetch(); toast.success(t("settings.apiKeyCreated")); }, onError: (err: { message?: string }) => toast.error(err.message || t("common.error")) });

  const apiKey = merchant?.apiKey ?? "";
  const { data: credits } = trpc.credits.summary.useQuery(undefined, { enabled: activeTab === "credits" });
  const [showApiKey, setShowApiKey] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ businessName: formData.businessName, email: formData.email, phone: formData.phone, contactMobile: formData.contactMobile.trim() || undefined, city: formData.city, address: formData.address });
      const dn = formData.displayName.trim();
      if (dn.length > 0) await updateProfileMutation.mutateAsync({ displayName: dn });
      await profileQuery.refetch();
      await meQuery.refetch();
      toast.success(t("settings.profileUpdated"));
    } catch { /* toast from mutation onError */ }
  };

  const handleAutomationSubmit = (e: React.FormEvent) => { e.preventDefault(); automationMutation.mutate(automationForm); };

  if (profileQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }
  if (profileQuery.error) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm border-0 dark:bg-card">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("common.error")}</p>
            <p className="text-sm text-muted-foreground mt-2">{t("dashboard.retry")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!merchant) return null;

  const safeTab = activeTabSet.has(activeTab) ? activeTab : "profile";

  return (
    <div className="space-y-6" dir={dir}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("settings.subtitle")}</p>
      </div>

      <Tabs value={safeTab} onValueChange={v => setLocation(v === "profile" ? "/settings" : `/settings?tab=${v}`)} className="space-y-4" dir={dir}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex" dir={dir}>
            {tabConfig.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <tab.icon className="w-4 h-4" />{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="profile">
          <Card className="shadow-sm border-0 dark:bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4 text-blue-500" />{t("settings.profile")}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("support.name")}</Label>
                    <Input value={formData.displayName} onChange={e => setFormData(f => ({ ...f, displayName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("settings.storeName")}</Label>
                    <Input value={formData.businessName} onChange={e => setFormData(f => ({ ...f, businessName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("support.email")}</Label>
                    <Input value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orders.phone")}</Label>
                    <Input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("settings.alternativePhone")}</Label>
                    <Input value={formData.contactMobile} onChange={e => setFormData(f => ({ ...f, contactMobile: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orders.city")}</Label>
                    <Input value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>{t("settings.address")}</Label>
                    <Input value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" disabled={updateMutation.isPending} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" />{t("common.save")}</>}
                </Button>
              </form>
            </CardContent>
          </Card>
          {meQuery.data && !meQuery.data.emailVerified && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("settings.emailNotVerified")}</AlertTitle>
              <AlertDescription className="flex items-center gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={() => resendVerifyMutation.mutate()} disabled={resendVerifyMutation.isPending}>
                  {t("settings.resendLink")}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="automation">
          <Card className="shadow-sm border-0 dark:bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Settings2 className="w-4 h-4 text-violet-500" />{t("settings.automation")}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAutomationSubmit} className="space-y-4">
                <div className="space-y-3">
                  {[
                    { id: "autoValidationEnabled", labelKey: "settings.autoVerification" },
                    { id: "whatsappValidationEnabled", labelKey: "settings.whatsappVerification" },
                    { id: "autoShippingSelectionEnabled", labelKey: "settings.autoShipping" },
                  ].map(({ id, labelKey }) => (
                    <label key={id} className="flex flex-row items-center justify-between cursor-pointer">
                      <span className="text-sm text-foreground">{t(labelKey)}</span>
                      <Switch checked={automationForm[id as keyof typeof automationForm] as boolean} onCheckedChange={v => setAutomationForm(f => ({ ...f, [id]: v }))} />
                    </label>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("settings.depositThreshold")} ({automationForm.trustThresholdForDeposit}%)</Label>
                    <input type="range" min={0} max={100} value={automationForm.trustThresholdForDeposit} onChange={e => setAutomationForm(f => ({ ...f, trustThresholdForDeposit: Number(e.target.value) }))} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("settings.defaultShipping")}</Label>
                    <Input value={automationForm.defaultShippingCompany} onChange={e => setAutomationForm(f => ({ ...f, defaultShippingCompany: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" disabled={automationMutation.isPending} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  {automationMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" />{t("common.save")}</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="shadow-sm border-0 dark:bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Key className="w-4 h-4 text-amber-500 dark:text-amber-400" />{t("settings.api")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.apiKey")}</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-muted/50 border border-border font-mono text-sm text-foreground truncate" dir="ltr">
                    {showApiKey ? apiKey : apiKey.slice(0, 12) + "••••••••••••••••"}
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                  <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(apiKey); toast.success(t("common.copied")); }}><Copy className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => regenerateMutation.mutate()} disabled={regenerateMutation.isPending}><RefreshCw className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="shadow-sm border-0 dark:bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-500" />{t("settings.social")}</CardTitle></CardHeader>
            <CardContent>
              <SocialSellersDashboard embedded />
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="credits">
          <Card className="shadow-sm border-0 dark:bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Coins className="w-4 h-4 text-emerald-500" />{t("settings.credits")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                <div className="p-3 rounded-xl bg-emerald-500 text-white"><Coins className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{t("settings.currentBalance")}</p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{credits?.balance ?? 0}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setLocation("/credits")}>{t("settings.manageCredits")}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-4">
            <Card className="shadow-sm border-0 dark:bg-card">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />{t("settings.loginHistory")}</CardTitle></CardHeader>
              <CardContent>
                {loginHistoryQuery.isLoading ? <Skeleton className="h-24" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border bg-muted/30">
                        <th className="text-start py-2 px-3 font-medium text-muted-foreground">{t("orders.date")}</th>
                        <th className="text-start py-2 px-3 font-medium text-muted-foreground">{t("settings.ip")}</th>
                      </tr></thead>
                      <tbody>
                        {(loginHistoryQuery.data ?? []).slice(0, 10).map((h: { createdAt: string; ipAddress: string }, i: number) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-2 px-3 text-foreground">{new Date(h.createdAt).toLocaleString(dir === "rtl" ? "ar-TN" : "fr-TN")}</td>
                            <td className="py-2 px-3 text-muted-foreground" dir="ltr">{h.ipAddress}</td>
                          </tr>
                        ))}
                        {(loginHistoryQuery.data ?? []).length === 0 && <tr><td colSpan={2} className="py-4 text-center text-muted-foreground">{t("common.noData")}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 dark:bg-card">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500 dark:text-amber-400" />{t("settings.notifications")}</CardTitle></CardHeader>
              <CardContent>
                {notificationsQuery.isLoading ? <Skeleton className="h-24" /> : (
                  (notificationsQuery.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">{t("common.noData")}</p>
                  ) : (
                    <ul className="space-y-2">
                      {(notificationsQuery.data ?? []).slice(0, 10).map((n: { id: string; message: string; read: boolean }) => (
                        <li key={n.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                          <span className="text-sm text-foreground">{n.message}</span>
                          {!n.read && <Button size="sm" variant="ghost" onClick={() => markReadMutation.mutate({ id: n.id })} className="text-xs">{t("settings.markAsRead")}</Button>}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
