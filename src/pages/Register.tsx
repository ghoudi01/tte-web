import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { StepIndicator } from "./register/components/StepIndicator";
import { Step1Personal } from "./register/components/Step1Personal";
import { Step2Company } from "./register/components/Step2Company";
import { Step3Products } from "./register/components/Step3Products";

export default function Register() {
  const [, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const register = appContent?.register;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    productTypes: [] as string[],
  });

  const passwordStrength = useMemo(() => {
    let strength = 0;
    const p = formData.password;
    if (p.length >= 8) strength += 1;
    if (p.length >= 12) strength += 1;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) strength += 1;
    if (/\d/.test(p)) strength += 1;
    if (/[^a-zA-Z\d]/.test(p)) strength += 1;
    return strength;
  }, [formData.password]);

  const passwordStrengthLabels = register?.passwordStrengthLabels ?? ["ضعيف جداً", "ضعيف", "متوسط", "قوي", "قوي جداً"];
  const isValidEmail = useMemo(() => formData.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), [formData.email]);
  const isValidPhone = useMemo(() => formData.phone === "" || /^(\+216|00216)?[2-9]\d{8}$/.test(formData.phone.replace(/\s/g, "")), [formData.phone]);
  const passwordsMatch = formData.password === formData.confirmPassword || formData.confirmPassword === "";

  const productOptions = register?.productOptions ?? [
    "إلكترونيات", "ملابس وأزياء", "أغذية ومشروبات", "أثاث ومنزل",
    "أدوات تجميل", "كتب ووسائل تعليمية", "ألعاب وترفيه",
    "رياضة ولياقة", "صحة وطب", "أخرى",
  ];

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء حسابك. سجّل الدخول الآن.");
      setLocation("/login");
    },
    onError: (err) => {
      toast.error(err.message ?? "فشل إنشاء الحساب");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error(register?.termsAlert ?? "يجب الموافقة على الشروط والأحكام");
      return;
    }
    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.name || undefined,
    });
  };

  const isStep1Valid = formData.name && isValidEmail && isValidPhone && passwordsMatch && formData.password.length >= 6;
  const isStep2Valid = formData.companyName && formData.companyAddress;
  const isStep3Valid = formData.productTypes.length > 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" dir="rtl">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-2 md:p-4 min-h-0">
        <div className="w-full max-w-6xl h-full flex items-center">
          <div className="bg-white rounded-lg shadow-lg border p-4 md:p-6 w-full">
            <div className="space-y-6">
              <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {register?.stepTitles?.[currentStep - 1]}
                </h1>
                <p className="text-sm text-slate-600">
                  {register?.stepDescriptions?.[currentStep - 1]}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {currentStep === 1 && (
                  <Step1Personal
                    formData={formData}
                    setFormData={setFormData}
                    isValidEmail={isValidEmail}
                    isValidPhone={isValidPhone}
                    passwordsMatch={passwordsMatch}
                    passwordStrength={passwordStrength}
                    passwordStrengthLabels={passwordStrengthLabels}
                    registerLabels={register?.labels}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Company formData={formData} setFormData={setFormData} />
                )}

                {currentStep === 3 && (
                  <Step3Products
                    formData={formData}
                    setFormData={setFormData}
                    productOptions={productOptions}
                    acceptedTerms={acceptedTerms}
                    setAcceptedTerms={setAcceptedTerms}
                    registerLabels={register?.labels}
                  />
                )}

                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 h-12 text-sm font-semibold"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      {register?.buttons?.previous ?? "السابق"}
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                      className="flex-1 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      {register?.buttons?.next ?? "التالي"}
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!acceptedTerms || !isStep3Valid || registerMutation.isPending}
                      className="flex-1 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      {registerMutation.isPending ? "جاري إنشاء الحساب…" : (register?.buttons?.submit ?? "إنشاء حساب")}
                    </Button>
                  )}
                </div>
              </form>

              <div className="text-center text-xs text-muted-foreground pt-2">
                {register?.haveAccount ?? "لديك حساب بالفعل؟"}{" "}
                <Link href="/login">
                  <Button variant="link" className="px-0 font-semibold h-auto text-xs py-0">
                    {register?.loginLink ?? "تسجيل الدخول"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
