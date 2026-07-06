import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { StepIndicator } from "./register/components/StepIndicator";
import { Step1Personal } from "./register/components/Step1Personal";
import { Step2Company } from "./register/components/Step2Company";
import { Step3Products } from "./register/components/Step3Products";
import { isValidTunisiaMobile } from "@/lib/tunisia-phone";

export default function Register() {
  const [, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const { t, dir } = useLanguage();
  const register = appContent?.register;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [referralFromUrl, setReferralFromUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    setReferralFromUrl(ref ?? undefined);
  }, []);
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

  const defaultStrengthLabels = [t("register.passwordVeryWeak"), t("register.passwordWeak"), t("register.passwordMedium"), t("register.passwordStrong"), t("register.passwordVeryStrong")];
  const passwordStrengthLabels = register?.passwordStrengthLabels ?? defaultStrengthLabels;
  const emailLooksValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
    [formData.email]
  );
  /** True when empty (no error styling) or when format is valid */
  const isValidEmail = useMemo(
    () => formData.email.trim() === "" || emailLooksValid,
    [formData.email, emailLooksValid]
  );
  const phoneLooksValid = useMemo(
    () => isValidTunisiaMobile(formData.phone),
    [formData.phone]
  );
  const isValidPhone = useMemo(
    () => formData.phone.trim() === "" || phoneLooksValid,
    [formData.phone, phoneLooksValid]
  );
  const passwordsMatch = formData.password === formData.confirmPassword || formData.confirmPassword === "";

  const defaultProductOptions = [
    t("register.productElectronics"), t("register.productClothing"), t("register.productFood"), t("register.productFurniture"),
    t("register.productCosmetics"), t("register.productBooks"), t("register.productToys"),
    t("register.productSports"), t("register.productHealth"), t("register.productOther"),
  ];
  const productOptions = register?.productOptions ?? defaultProductOptions;

  const availabilityQuery = trpc.auth.checkRegisterAvailability.useQuery(
    {
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      companyEmail: formData.companyEmail.trim() || undefined,
      companyPhone: formData.companyPhone.trim() || undefined,
    },
    { enabled: false },
  );

  const utils = trpc.useUtils();

  const registerMutation = trpc.auth.register.useMutation();
  const loginMutation = trpc.auth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error(t("register.termsAlert"));
      return;
    }
    const email = formData.email.trim();
    const password = formData.password;
    try {
      await registerMutation.mutateAsync({
        email,
        password,
        referralCode: referralFromUrl,
        displayName: formData.name.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        companyAddress: formData.companyAddress.trim(),
        companyPhone: formData.companyPhone.trim() || undefined,
        companyEmail: formData.companyEmail.trim() || undefined,
        productTypes: formData.productTypes,
      });
      toast.success(t("register.success"));
      await loginMutation.mutateAsync({ email, password });
      utils.auth.me.invalidate();
      setLocation("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? t("register.error"));
    }
  };

  const handleNext = async () => {
    const result = await availabilityQuery.refetch();
    if (currentStep === 1) {
      if (result.data?.emailTaken) {
        toast.error(t("register.emailTaken"));
        return;
      }
      if (result.data?.phoneTaken) {
        toast.error(t("register.phoneTaken"));
        return;
      }
    }
    if (currentStep === 2) {
      if (result.data?.companyEmailTaken) {
        toast.error(t("register.companyEmailTaken"));
        return;
      }
      if (result.data?.companyPhoneTaken) {
        toast.error(t("register.companyPhoneTaken"));
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const isStep1Valid =
    formData.name.trim().length > 0 &&
    emailLooksValid &&
    phoneLooksValid &&
    passwordsMatch &&
    formData.password.length >= 6;
  const isStep2Valid = formData.companyName && formData.companyAddress;
  const isStep3Valid = formData.productTypes.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 flex flex-col min-h-0 pt-20 md:pt-24">
        <div className="w-full mb-6">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-2 md:p-4 pt-0">
          <div className="w-full max-w-6xl">
            <div className="bg-card rounded-lg shadow-lg border border-border p-4 md:p-6 w-full">
              <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground mb-1">
                  {register?.stepTitles?.[currentStep - 1] ?? t(`register.step${currentStep}Title`)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {register?.stepDescriptions?.[currentStep - 1] ?? t(`register.step${currentStep}Desc`)}
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

                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 h-12 text-sm font-semibold"
                    >
                      <ArrowRight className="w-4 h-4 ms-2 ltr:rotate-180" />
                      {t("register.previous")}
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={(currentStep === 1 && (!isStep1Valid || availabilityQuery.isFetching)) || (currentStep === 2 && (!isStep2Valid || availabilityQuery.isFetching))}
                      className="flex-1 h-12 text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {availabilityQuery.isFetching ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          {t("register.checking")}
                        </span>
                      ) : (
                        <>
                          {t("register.next")}
                          <ArrowLeft className="w-4 h-4 me-2 ltr:rotate-180" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!acceptedTerms || !isStep3Valid || registerMutation.isPending}
                      className="flex-1 h-12 text-sm font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {registerMutation.isPending ? t("common.sending") : t("nav.register")}
                    </Button>
                  )}
                </div>
              </form>

              <div className="text-center text-xs text-muted-foreground pt-2">
                {t("register.haveAccount")} {" "}
                <Link href="/login">
                  <Button variant="link" className="px-0 font-semibold h-auto text-xs py-0 dark:text-blue-400">
                    {t("register.loginLink")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
}
