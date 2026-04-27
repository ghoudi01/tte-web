import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { Mail, Phone, Lock, Eye, EyeOff, Chrome, Facebook, User, CheckCircle2, XCircle, Building2, Package, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { isValidTunisiaPhone } from "@/lib/phone";
import { AUTH_TOKEN_STORAGE_KEY } from "@/const";
import { toast } from "sonner";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { RegisterStepIndicator } from "./register/components/RegisterStepIndicator";

export default function Register() {
  const [, setLocation] = useLocation();
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const register = appContent?.register;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2: Company Info
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    // Step 3: Products
    productTypes: [] as string[],
  });

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordStrengthLabels = register?.passwordStrengthLabels ?? ["ضعيف جداً", "ضعيف", "متوسط", "قوي", "قوي جداً"];
  const passwordStrengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = formData.email === "" || emailRegex.test(formData.email);

  // Phone validation (Tunisia only: +216/00216 or local 8 digits)
  const isValidPhone = formData.phone === "" || isValidTunisiaPhone(formData.phone);

  const passwordsMatch = formData.password === formData.confirmPassword || formData.confirmPassword === "";

  const productOptions = register?.productOptions ?? [
    "إلكترونيات",
    "ملابس وأزياء",
    "أغذية ومشروبات",
    "أثاث ومنزل",
    "أدوات تجميل",
    "كتب ووسائل تعليمية",
    "ألعاب وترفيه",
    "رياضة ولياقة",
    "صحة وطب",
    "أخرى",
  ];

  const handleProductToggle = (product: string) => {
    setFormData(prev => ({
      ...prev,
      productTypes: prev.productTypes.includes(product)
        ? prev.productTypes.filter(p => p !== product)
        : [...prev.productTypes, product]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const registerMutation = trpc.auth.register.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const createMerchantMutation = trpc.merchants.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error(register?.termsAlert ?? "يجب الموافقة على الشروط والأحكام");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        phone: formData.phone || undefined,
      });

      // Login immediately so merchant profile data can be persisted server-side.
      const loginResult = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, loginResult.token);
      }

      await createMerchantMutation.mutateAsync({
        businessName: formData.companyName,
        email: formData.companyEmail || formData.email,
        phone: formData.companyPhone || formData.phone,
        address: formData.companyAddress || undefined,
        productTypes: formData.productTypes,
      });

      toast.success("تم إنشاء حسابك وملف شركتك بنجاح.");
      setLocation("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل إنشاء الحساب";
      toast.error(message);
    }
  };

  const isStep1Valid = formData.name && isValidEmail && isValidPhone && passwordsMatch && formData.password;
  const isStep2Valid = formData.companyName && formData.companyAddress;
  const isStep3Valid = formData.productTypes.length > 0;

  const handleOAuthRegister = (provider: "google" | "facebook") => {
    // Static OAuth - no actual implementation
    console.log(`OAuth registration with ${provider}`);
    // In real implementation, this would redirect to OAuth provider
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" dir="rtl">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-2 md:p-4 min-h-0">
        <div className="w-full max-w-6xl h-full flex items-center">
          <div className="bg-white rounded-lg shadow-lg border p-4 md:p-6 w-full">
            <div className="space-y-6" dir="rtl">
              {/* Step Indicators */}
              <RegisterStepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
              />

              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {register?.stepTitles?.[currentStep - 1] ??
                    ((currentStep === 1 && "معلوماتك الشخصية") ||
                      (currentStep === 2 && "معلومات الشركة") ||
                      "نوع المنتجات")}
                </h1>
                <p className="text-sm text-slate-600">
                  {register?.stepDescriptions?.[currentStep - 1] ??
                    ((currentStep === 1 && "أدخل معلوماتك الشخصية للبدء") ||
                      (currentStep === 2 && "أدخل معلومات شركتك") ||
                      "اختر نوع المنتجات التي تبيعها")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">الاسم الكامل</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="أدخل اسمك الكامل"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`pr-10 pl-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${!isValidEmail && formData.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                            required
                          />
                          {formData.email && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              {isValidEmail ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {!isValidEmail && formData.email && (
                          <p className="text-xs text-red-500 mt-1">البريد الإلكتروني غير صحيح</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-slate-700">رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+216 XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`pr-10 pl-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${!isValidPhone && formData.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          required
                        />
                        {formData.phone && (
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            {isValidPhone ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {!isValidPhone && formData.phone && (
                        <p className="text-xs text-red-500 mt-1">رقم الهاتف غير صحيح (يجب أن يكون رقم تونسي)</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="space-y-1.5">
                            <Progress
                              value={(passwordStrength / 5) * 100}
                              className="h-2"
                            />
                            <p className={`text-xs font-medium ${
                              passwordStrength <= 1 ? "text-red-500" :
                              passwordStrength <= 2 ? "text-orange-500" :
                              passwordStrength <= 3 ? "text-yellow-500" :
                              passwordStrength <= 4 ? "text-blue-500" : "text-green-600"
                            }`}>
                              {(register?.labels?.passwordStrength ?? "قوة كلمة المرور:")} {passwordStrengthLabels[passwordStrength - 1] || passwordStrengthLabels[0]}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">تأكيد كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${!passwordsMatch && formData.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          {formData.confirmPassword && (
                            <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
                              {passwordsMatch ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {!passwordsMatch && formData.confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">كلمات المرور غير متطابقة</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Company Info */}
                {currentStep === 2 && (
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
                )}

                {/* Step 3: Product Types */}
                {currentStep === 3 && (
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
                        <p className="text-xs text-red-500">{register?.labels?.selectOneProduct ?? "يجب اختيار نوع واحد على الأقل"}</p>
                      )}
                    </div>

                    <div className="flex items-start space-x-2 space-x-reverse text-xs pt-2">
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
                        {register?.labels?.agreeTerms ?? "أوافق على"}{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          {register?.labels?.termsAndConditions ?? "الشروط والأحكام"}
                        </Link>
                        {" "}و{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          {register?.labels?.privacyPolicy ?? "سياسة الخصوصية"}
                        </Link>
                      </Label>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex-1 h-12 text-sm font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      {register?.buttons?.previous ?? "السابق"}
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (currentStep === 1 && !isStep1Valid) ||
                        (currentStep === 2 && !isStep2Valid)
                      }
                      className="flex-1 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                      {register?.buttons?.next ?? "التالي"}
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={
                        !acceptedTerms ||
                        !isStep3Valid ||
                        registerMutation.isPending ||
                        loginMutation.isPending ||
                        createMerchantMutation.isPending
                      }
                      className="flex-1 h-12 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                      {registerMutation.isPending ||
                      loginMutation.isPending ||
                      createMerchantMutation.isPending
                        ? "جاري إنشاء الحساب…"
                        : (register?.buttons?.submit ?? "إنشاء حساب")}
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

