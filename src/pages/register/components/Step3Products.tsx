import { CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
        <Label className="text-sm w-full justify-start">{t("register.selectProduct")}</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {productOptions.map((product) => (
            <button
              key={product}
              type="button"
              onClick={() => handleProductToggle(product)}
              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                formData.productTypes.includes(product)
                  ? "border-primary dark:border-blue-500 bg-primary/10 dark:bg-blue-900/60 font-semibold"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="min-w-0 flex-1 text-start leading-snug">
                  {product}
                </span>
                {formData.productTypes.includes(product) && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary dark:text-blue-400" aria-hidden />
                )}
              </div>
            </button>
          ))}
        </div>
        {formData.productTypes.length === 0 && (
          <p className="text-xs text-red-500 dark:text-red-400">
            {registerLabels?.selectOneProduct ?? t("register.selectOneProduct")}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 pt-3 text-xs leading-relaxed">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          className="mt-1 shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p>
            <label
              htmlFor="terms"
              className="cursor-pointer select-none text-foreground"
            >
              {registerLabels?.agreeTerms ?? t("register.agreeTerms")}
            </label>{" "}
            <Link
              href="/terms"
              className="inline-flex items-center gap-0.5 font-semibold text-primary dark:text-blue-400 underline decoration-primary/60 dark:decoration-blue-400/60 underline-offset-2 hover:text-primary/80 dark:hover:text-blue-300 hover:decoration-primary/80 dark:hover:decoration-blue-300/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:focus-visible:ring-blue-400/40 focus-visible:rounded-sm cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {registerLabels?.termsAndConditions ?? t("register.termsAndConditions")}
            </Link>{" "}
            <span className="text-muted-foreground" aria-hidden>
              {t("register.and")}
            </span>{" "}
            <Link
              href="/privacy"
              className="inline-flex items-center gap-0.5 font-semibold text-primary dark:text-blue-400 underline decoration-primary/60 dark:decoration-blue-400/60 underline-offset-2 hover:text-primary/80 dark:hover:text-blue-300 hover:decoration-primary/80 dark:hover:decoration-blue-300/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:focus-visible:ring-blue-400/40 focus-visible:rounded-sm cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {registerLabels?.privacyPolicy ?? t("register.privacyPolicy")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
