import { Building2, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Step2CompanyProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function Step2Company({ formData, setFormData }: Step2CompanyProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-slate-700">اسم الشركة</Label>
          <div className="relative">
            <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="companyName"
              type="text"
              placeholder="أدخل اسم الشركة"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress" className="text-sm font-medium text-slate-700">عنوان الشركة</Label>
          <div className="relative">
            <Input
              id="companyAddress"
              type="text"
              placeholder="أدخل عنوان الشركة"
              value={formData.companyAddress}
              onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
              className="h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="companyPhone" className="text-sm font-medium text-slate-700">هاتف الشركة</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="companyPhone"
              type="tel"
              placeholder="+216 XX XXX XXX"
              value={formData.companyPhone}
              onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
              className="pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyEmail" className="text-sm font-medium text-slate-700">بريد الشركة الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="companyEmail"
              type="email"
              placeholder="company@email.com"
              value={formData.companyEmail}
              onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
              className="pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>
    </>
  );
}
