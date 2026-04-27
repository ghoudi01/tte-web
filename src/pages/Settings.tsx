import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Webhook,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

const WEBHOOK_EVENT_TYPES = [
  "order.created",
  "order.updated",
  "order.spam_reported",
  "order.feedback_received",
  "verification.completed",
  "credit.converted",
  "credit.withdrawal_requested",
  "referral.activated",
  "merchant.created",
  "report.submitted",
  "report.status_changed",
] as const;

export type WebhookEventType = typeof WEBHOOK_EVENT_TYPES[number];

export default function Settings() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.settings;
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const automationQuery = trpc.automation.getMerchantConfig.useQuery();
  const merchant = profileQuery.data ?? null;

  // Webhook state and queries
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<WebhookEventType[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [testForm, setTestForm] = useState({ url: "" });

  // tRPC queries for webhooks
  const webhookStatsQuery = trpc.webhooks.getStats.useQuery(undefined, {
    enabled: !!merchant,
  });
  const webhookListQuery = trpc.webhooks.listSubscriptions.useQuery(undefined, {
    enabled: !!merchant,
  });

  // Mutations
  const updateMutation = trpc.merchants.update.useMutation({
    onSuccess: () => {
      profileQuery.refetch();
      toast.success("تم تحديث الملف الشخصي بنجاح");
    },
    onError: (err) => toast.error(err.message || "فشل التحديث"),
  });

  const automationMutation = trpc.automation.updateMerchantConfig.useMutation({
    onSuccess: () => {
      automationQuery.refetch();
      toast.success("تم حفظ إعدادات التشغيل الآلي");
    },
    onError: (err) => toast.error(err.message || "فشل حفظ الإعدادات"),
  });

  const regenerateMutation = trpc.merchants.regenerateApiKey.useMutation({
    onSuccess: () => {
      void profileQuery.refetch();
      toast.success("تم إنشاء مفتاح API جديد");
    },
    onError: (err) => toast.error(err.message || "فشل إنشاء المفتاح"),
  });

  const createWebhookMutation = trpc.webhooks.createSubscription.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الوبهووك بنجاح");
      setShowCreateForm(false);
      setWebhookUrl("");
      setWebhookEvents([]);
      webhookListQuery.refetch();
    },
    onError: (err: any) => toast.error(err.message || "فشل إنشاء الوبهووك"),
  });

  const deleteWebhookMutation = trpc.webhooks.deleteSubscription.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الوبهووك");
      webhookListQuery.refetch();
    },
  });

  const testWebhookMutation = trpc.webhooks.testWebhook.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          `تم الإرسال بنجاح! (Status: ${data.responseStatus})`,
        );
      } else {
        toast.error(`فشل الإرسال: ${data.error}`);
      }
    },
    onError: (err: any) => toast.error(err.message || "فشل اختبار الوبهووك"),
  });

  useEffect(() => {
    if (profileQuery.isSuccess && merchant === null) {
      setLocation("/merchant-setup");
    }
  }, [profileQuery.isSuccess, merchant, setLocation]);

  const activeTab = useMemo(() => {
    if (!search) return "profile";
    const params = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search,
    );
    const tab = params.get("tab") || "profile";
    if (["profile", "automation", "api", "webhooks", "credits"].includes(tab))
      return tab;
    return "profile";
  }, [search]);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });
  const [automationForm, setAutomationForm] = useState({
    autoValidationEnabled: true,
    whatsappValidationEnabled: true,
    autoShippingSelectionEnabled: true,
    trustThresholdForDeposit: 40,
    defaultShippingCompany: "Rapid-Poste",
  });

  useEffect(() => {
    if (merchant) {
      setFormData({
        businessName: merchant.businessName ?? "",
        email: merchant.email ?? "",
        phone: merchant.phone ?? "",
        city: merchant.city ?? "",
        address: merchant.address ?? "",
      });
    }
  }, [merchant]);

  useEffect(() => {
    if (automationQuery.data) {
      setAutomationForm(automationQuery.data);
    }
  }, [automationQuery.data]);

  const apiKey = merchant?.apiKey ?? "";

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAutomationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    automationMutation.mutate(automationForm);
  };

  const toggleWebhookEvent = (event: WebhookEventType) => {
    setWebhookEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event],
    );
  };

  if (profileQuery.isLoading)
    return (
      <div className="p-6" dir="rtl">
        {c?.loadingText ?? "جاري التحميل..."}
      </div>
    );
  if (!merchant) return null;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {c?.pageTitle ?? "الإعدادات"}
          </h1>
          <p className="text-lg text-slate-600">
            {c?.pageSubtitle ?? "الملف الشخصي، مفتاح API، والإعدادات التلقائية"}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setLocation(v === "profile" ? "/settings" : `/settings?tab=${v}`)
          }
          className="space-y-4"
          dir="rtl"
        >
          <TabsList>
            <TabsTrigger value="profile">{c?.profileTab ?? "الملف الشخصي"}</TabsTrigger>
            <TabsTrigger value="automation">{c?.automationTab ?? "الإعدادات التلقائية"}</TabsTrigger>
            <TabsTrigger value="api">{c?.apiTab ?? "مفتاح API"}</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="credits">الاعتمادات</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>الملف الشخصي</CardTitle>
                <CardDescription>تحديث معلومات الحساب</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <Input
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, businessName: e.target.value }))
                    }
                    placeholder="اسم العمل"
                  />
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="البريد"
                  />
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="الهاتف"
                  />
                  <Button type="submit" className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle>إعداد التشغيل الآلي</CardTitle>
                <CardDescription>
                  فعّل التحقق التلقائي واختيار الشحن والحد الأدنى للثقة.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAutomationSubmit} className="space-y-4">
                  <label className="flex items-center justify-between rounded border bg-white p-3">
                    <span>تفعيل التحقق التلقائي</span>
                    <input
                      type="checkbox"
                      checked={automationForm.autoValidationEnabled}
                      onChange={(e) =>
                        setAutomationForm((p) => ({
                          ...p,
                          autoValidationEnabled: e.target.checked,
                        }))
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between rounded border bg-white p-3">
                    <span>تفعيل التحقق عبر واتساب</span>
                    <input
                      type="checkbox"
                      checked={automationForm.whatsappValidationEnabled}
                      onChange={(e) =>
                        setAutomationForm((p) => ({
                          ...p,
                          whatsappValidationEnabled: e.target.checked,
                        }))
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between rounded border bg-white p-3">
                    <span>اختيار شركة الشحن تلقائياً</span>
                    <input
                      type="checkbox"
                      checked={automationForm.autoShippingSelectionEnabled}
                      onChange={(e) =>
                        setAutomationForm((p) => ({
                          ...p,
                          autoShippingSelectionEnabled: e.target.checked,
                        }))
                      }
                    />
                  </label>
                  <div className="space-y-2">
                    <Label>حد الثقة لطلب عربون</Label>
                    <Input
                      type="number"
                      min={10}
                      max={90}
                      value={automationForm.trustThresholdForDeposit}
                      onChange={(e) =>
                        setAutomationForm((p) => ({
                          ...p,
                          trustThresholdForDeposit: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>شركة الشحن الافتراضية</Label>
                    <Input
                      value={automationForm.defaultShippingCompany}
                      onChange={(e) =>
                        setAutomationForm((p) => ({
                          ...p,
                          defaultShippingCompany: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    حفظ إعدادات التشغيل
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>مفاتيح API</CardTitle>
                <CardDescription>
                  استخدم هذا المفتاح للربط مع متاجر Shopify، WooCommerce، أو أتمتة خارجية.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200">
                  <code className="flex-1 text-sm font-mono text-slate-700 break-all">
                    {apiKey}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(apiKey);
                      toast.success("تم النسخ");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => regenerateMutation.mutate()}
                  disabled={regenerateMutation.isPending}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {regenerateMutation.isPending ? "جاري الإنشاء..." : "إنشاء مفتاح جديد"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <div className="space-y-6">
              {/* Stats Overview */}
              {(webhookStatsQuery.data || (webhookListQuery.data && {
                subscriptions: webhookListQuery.data?.subscriptions?.length || 0,
              })) && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            الوبهووكات النشطة
                          </p>
                          <p className="text-2xl font-bold">
                            {webhookStatsQuery.data?.activeSubscriptions ||
                              webhookListQuery.data?.subscriptions.length ||
                              0}
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            معدل النجاح
                          </p>
                          <p className="text-2xl font-bold">
                            {webhookStatsQuery.data?.successRate ?? 0}%
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            إجمالي الإرسالات
                          </p>
                          <p className="text-2xl font-bold">
                            {webhookStatsQuery.data?.totalDeliveries || 0}
                          </p>
                        </div>
                        <ExternalLink className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">أخطاء حديثة</p>
                          <p className="text-2xl font-bold text-red-500">
                            {webhookStatsQuery.data?.recentFailures || 0}
                          </p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Create New Webhook */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>إنشاء webhook جديد</CardTitle>
                      <CardDescription>
                        استلم إشعارات فورية عند أحداث النظام
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      جديد
                    </Button>
                  </div>
                </CardHeader>
                {showCreateForm && (
                  <CardContent className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label>رابط الوجهة (URL)</Label>
                      <Input
                        placeholder="https://your-app.com/api/webhooks/tte"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الأحداث المراد الاشتراك بها</Label>
                      <div className="flex flex-wrap gap-2">
                        {WEBHOOK_EVENT_TYPES.map((event) => (
                          <Badge
                            key={event}
                            variant={
                              webhookEvents.includes(event)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleWebhookEvent(event)}
                          >
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (!webhookUrl) {
                            toast.error("الرجاء إدخال الرابط");
                            return;
                          }
                          if (webhookEvents.length === 0) {
                            toast.error("اختر حدث واحد على الأقل");
                            return;
                          }
                          createWebhookMutation.mutate({
                            url: webhookUrl,
                            eventTypes: webhookEvents,
                          });
                        }}
                        disabled={createWebhookMutation.isPending}
                      >
                        {createWebhookMutation.isPending
                          ? "جاري الإنشاء..."
                          : "إنشاء الوبهووك"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setWebhookUrl("");
                          setWebhookEvents([]);
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* List Subscriptions */}
              <Card>
                <CardHeader>
                  <CardTitle>الوبهوكات الحالية</CardTitle>
                  <CardDescription>
                    إدارة الوبهووكات النشطة ومحاولات التسليم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {webhookListQuery.data?.subscriptions?.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Webhook className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>لا توجد وبوهوكات مكونة بعد</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {webhookListQuery.data?.subscriptions?.map((sub: any) => (
                        <div
                          key={sub.id}
                          className="rounded-lg border bg-white p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant={sub.isActive ? "default" : "secondary"}
                                >
                                  {sub.isActive ? "نشط" : "متوقف"}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {new Date(sub.createdAt).toLocaleDateString("ar-TN")}
                                </span>
                              </div>
                              <a
                                href={sub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-blue-600 hover:underline truncate block"
                              >
                                {sub.url}
                              </a>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {sub.eventTypes.map((ev: string) => (
                                  <Badge
                                    key={ev}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {ev}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  testWebhookMutation.mutate({ url: sub.url })
                                }
                                disabled={testWebhookMutation.isPending}
                              >
                                اختبار
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteWebhookMutation.mutate({ id: sub.id })
                                }
                                disabled={deleteWebhookMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>الاعتمادات</CardTitle>
                <CardDescription>إدارة رصيد الاعتمادات والعمليات المالية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border bg-white p-6">
                    <div>
                      <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
                      <p className="text-4xl font-bold text-teal-600">
                        {(merchant as { creditsBalance?: number })?.creditsBalance ?? 0}
                      </p>
                    </div>
                    <Button onClick={() => setLocation("/pricing")}>
                      شراء اعتمادات
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 rounded bg-slate-50">
                      <p className="font-semibold">فحص رقم جديد</p>
                      <p className="text-slate-600">5 اعتمادات</p>
                    </div>
                    <div className="p-3 rounded bg-slate-50">
                      <p className="font-semibold">إعادة فحص</p>
                      <p className="text-slate-600">2 اعتماد</p>
                    </div>
                    <div className="p-3 rounded bg-slate-50">
                      <p className="font-semibold">تقرير مقبول</p>
                      <p className="text-slate-600">+2 اعتماد</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}