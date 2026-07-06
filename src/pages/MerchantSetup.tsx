import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MerchantSetup() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const profileQuery = trpc.merchants.getProfile.useQuery();
  const createMutation = trpc.merchants.create.useMutation({
    onSuccess: () => {
      toast.success(t("merchantSetup.success"));
      setLocation("/dashboard");
    },
    onError: (err: any) => toast.error(err.message || t("merchantSetup.error")),
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
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4" dir={dir}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{t("merchantSetup.title")}</h1>
          <p className="text-lg text-slate-600">{t("merchantSetup.subtitle")}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("merchantSetup.workInfo")}</CardTitle>
            <CardDescription>{t("merchantSetup.workInfoDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">{t("merchantSetup.businessName")}</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder={t("merchantSetup.businessNamePlaceholder")}
                    required
                   
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("merchantSetup.email")}</Label>
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
                  <Label htmlFor="phone">{t("merchantSetup.phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                    required
                   
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t("merchantSetup.city")}</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t("merchantSetup.city")}
                   
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t("merchantSetup.address")}</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t("merchantSetup.addressPlaceholder")}
                 
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {t("merchantSetup.apiNote")}
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
                {t("merchantSetup.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
