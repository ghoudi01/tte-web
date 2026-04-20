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
import { Copy, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.settings;
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const automationQuery = trpc.automation.getMerchantConfig.useQuery();
  const merchant = profileQuery.data ?? null;

  useEffect(() => {
    if (profileQuery.isSuccess && merchant === null) {
      setLocation("/merchant-setup");
    }
  }, [profileQuery.isSuccess, merchant, setLocation]);

  const activeTab = useMemo(() => {
    if (!search) return "profile";
    const params = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search
    );
    const tab = params.get("tab") || "profile";
    if (tab === "api" || tab === "credits" || tab === "automation") return tab;
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

  const updateMutation = trpc.merchants.update.useMutation({
    onSuccess: () => {
      profileQuery.refetch();
      toast.success("تم تحديث الملف الشخصي بنجاح");
    },
    onError: err => toast.error(err.message || "فشل التحديث"),
  });

  const automationMutation = trpc.automation.updateMerchantConfig.useMutation({
    onSuccess: () => {
      automationQuery.refetch();
      toast.success("تم حفظ إعدادات التشغيل الآلي");
    },
    onError: err => toast.error(err.message || "فشل حفظ إعدادات التشغيل"),
  });

  const regenerateMutation = trpc.merchants.regenerateApiKey.useMutation({
    onSuccess: () => {
      void profileQuery.refetch();
      toast.success("تم إنشاء مفتاح API جديد");
    },
    onError: err => toast.error(err.message || "فشل إنشاء المفتاح"),
  });

  const apiKey = merchant?.apiKey ?? "";

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAutomationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    automationMutation.mutate(automationForm);
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "الإعدادات"}</h1>
          <p className="text-lg text-slate-600">
            {c?.pageSubtitle ?? "الملف الشخصي، مفتاح API، والإعدادات التلقائية"}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={v =>
            setLocation(v === "profile" ? "/settings" : `/settings?tab=${v}`)
          }
          className="space-y-4"
          dir="rtl"
        >
          <TabsList>
            <TabsTrigger value="profile">{c?.profileTab ?? "الملف الشخصي"}</TabsTrigger>
            <TabsTrigger value="automation">{c?.automationTab ?? "الإعدادات التلقائية"}</TabsTrigger>
            <TabsTrigger value="api">{c?.apiTab ?? "مفتاح API"}</TabsTrigger>
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
                    onChange={e =>
                      setFormData(p => ({ ...p, businessName: e.target.value }))
                    }
                    placeholder="اسم العمل"
                  />
                  <Input
                    value={formData.email}
                    onChange={e =>
                      setFormData(p => ({ ...p, email: e.target.value }))
                    }
                    placeholder="البريد"
                  />
                  <Input
                    value={formData.phone}
                    onChange={e =>
                      setFormData(p => ({ ...p, phone: e.target.value }))
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
                      onChange={e =>
                        setAutomationForm(p => ({
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
                      onChange={e =>
                        setAutomationForm(p => ({
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
                      onChange={e =>
                        setAutomationForm(p => ({
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
                      onChange={e =>
                        setAutomationForm(p => ({
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
                      onChange={e =>
                        setAutomationForm(p => ({
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
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إنشاء مفتاح جديد
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>الاعتمادات</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>
                  {(merchant as { creditsBalance?: number })?.creditsBalance ??
                    0}{" "}
                  اعتماد
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
