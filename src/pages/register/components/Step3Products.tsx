import { CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

interface Step3ProductsProps {
  formData: any;
  setFormData: (data: any) => void;
  productOptions: string[];
  acceptedTerms: boolean;
  setAcceptedTerms: (accepted: boolean) => void;
  registerLabels: any;
}

export function Step3Products({
  formData,
  setFormData,
  productOptions,
  acceptedTerms,
  setAcceptedTerms,
  registerLabels,
}: Step3ProductsProps) {
  const handleProductToggle = (product: string) => {
    setFormData((prev: any) => ({
      ...prev,
      productTypes: prev.productTypes.includes(product)
        ? prev.productTypes.filter((p: string) => p !== product)
        : [...prev.productTypes, product],
    }));
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm">اختر نوع المنتجات التي تبيعها</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {productOptions.map((product) => (
            <button
              key={product}
              type="button"
              onClick={() => handleProductToggle(product)}
              className={`p-3 rounded-lg border-2 text-sm text-right transition-all ${
                formData.productTypes.includes(product)
                  ? "border-slate-900 bg-slate-50 font-semibold"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{product}</span>
                {formData.productTypes.includes(product) && (
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                )}
              </div>
            </button>
          ))}
        </div>
        {formData.productTypes.length === 0 && (
          <p className="text-xs text-red-500">
            {registerLabels?.selectOneProduct ?? "يجب اختيار نوع واحد على الأقل"}
          </p>
        )}
      </div>

      <div className="flex items-start space-x-1.5 space-x-reverse text-xs pt-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          className="w-3.5 h-3.5 mt-0.5"
        />
        <Label
          htmlFor="terms"
          className="text-xs font-normal cursor-pointer leading-relaxed"
        >
          {registerLabels?.agreeTerms ?? "أوافق على"}{" "}
          <Link href="/terms" className="text-primary hover:underline">
            {registerLabels?.termsAndConditions ?? "الشروط والأحكام"}
          </Link>{" "}
          و{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            {registerLabels?.privacyPolicy ?? "سياسة الخصوصية"}
          </Link>
        </Label>
      </div>
    </>
  );
}
