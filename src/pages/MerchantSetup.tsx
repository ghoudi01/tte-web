import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { isValidTunisiaPhone } from "@/lib/phone";

export default function MerchantSetup() {
  const [, setLocation] = useLocation();
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const createMutation = trpc.merchants.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء حسابك بنجاح!");
      setLocation("/dashboard");
    },
    onError: (err) => toast.error(err.message || "فشل إنشاء الحساب"),
  });

  useEffect(() => {
    if (profileQuery.isSuccess && profileQuery.data) {
      setLocation("/dashboard");
    }
  }, [profileQuery.isSuccess, profileQuery.data, setLocation]);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTunisiaPhone(formData.phone)) {
      toast.error("رقم الهاتف غير صحيح. الرجاء إدخال رقم تونسي صالح.");
      return;
    }
    createMutation.mutate(formData);
  };

  const isValidPhone = formData.phone === "" || isValidTunisiaPhone(formData.phone);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">إنشاء حساب تاجر</h1>
          <p className="text-lg text-slate-600">ابدأ مع محرك الثقة التونسي اليوم</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>معلومات العمل</CardTitle>
            <CardDescription>أدخل معلومات متجرك الإلكتروني</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">اسم العمل *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="مثال: متجري الإلكتروني"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                    className={!isValidPhone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    required
                  />
                  {!isValidPhone && (
                    <p className="text-xs text-red-500">الرجاء إدخال رقم تونسي صالح (8 أرقام).</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="تونس"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="عنوان المتجر"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ✓ سيتم إنشاء مفتاح API خاص بك تلقائياً بعد التسجيل
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-base">
                إنشاء الحساب
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
