import { Building2, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step2CompanyProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function Step2Company({ formData, setFormData }: Step2CompanyProps) {
  const { t } = useLanguage();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-foreground">{t("register.companyName")}</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute start-3 top-1/2 z-[1] size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="companyName"
              type="text"
              placeholder={t("register.companyNamePlaceholder")}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              dir="rtl"
              className="h-11 ps-10 text-sm border-border focus:border-primary focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress" className="text-sm font-medium text-foreground">{t("register.companyAddress")}</Label>
          <div className="relative">
            <Input
              id="companyAddress"
              type="text"
              placeholder={t("register.companyAddressPlaceholder")}
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              className="h-11 text-sm border-border focus:border-primary focus:ring-primary"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="companyPhone" className="text-sm font-medium text-foreground">{t("register.companyPhone")}</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="companyPhone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+216 XX XXX XXX"
              value={formData.companyPhone}
              onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
              dir="ltr"
              className="h-11 ps-10 pe-10 text-sm border-border focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyEmail" className="text-sm font-medium text-foreground">{t("register.companyEmail")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="companyEmail"
              type="email"
              placeholder="company@email.com"
              value={formData.companyEmail}
              onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
              dir="ltr"
              autoComplete="email"
              className="h-11 ps-10 pe-10 text-sm border-border focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </>
  );
}
