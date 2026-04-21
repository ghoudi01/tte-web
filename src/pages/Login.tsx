import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useLocation } from "wouter";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

const OTP_LENGTH = 6;

export default function Login() {
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const login = appContent?.login;
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (result) => {
      utils.auth.me.setData(undefined, result.user);
      void utils.auth.me.invalidate();
      setLocation("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message ?? "فشل تسجيل الدخول");
    },
  });
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"phone" | "otp">("phone");
  const [otpValue, setOtpValue] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) return;
    setSendingOtp(true);
    toast.info("تسجيل الدخول بالهاتف غير متاح هنا. استخدم البريد وكلمة المرور.");
    setSendingOtp(false);
  };

  /** Login on same page via server (email + password). No redirect to OAuth. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone") {
      if (phoneStep === "phone") {
        handleSendOtp(e);
        return;
      }
      if (otpValue.length !== OTP_LENGTH) return;
      toast.info("تسجيل الدخول بالهاتف غير متاح هنا. استخدم البريد وكلمة المرور.");
      return;
    }
    loginMutation.mutate({ email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" dir="rtl">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-2 md:p-4 min-h-0">
        <div className="w-full max-w-6xl h-full flex items-center">
          <div className="bg-white rounded-lg shadow-lg border p-4 md:p-6 w-full">
            <div className="grid md:grid-cols-2 gap-6 items-stretch w-full">
              {/* Left Side - Form */}
              <div className="space-y-3 flex flex-col justify-center" dir="rtl">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    {login?.title ?? "تسجيل الدخول"}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {login?.subtitle ?? "أدخل بياناتك للوصول إلى حسابك"}
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Login Method Toggle */}
                  <div className="flex gap-1.5 p-0.5 bg-slate-100 rounded-md">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("email");
                        setPhoneStep("phone");
                        setOtpValue("");
                      }}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                        loginMethod === "email"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {login?.tabEmail ?? "بريد"}
                    </button>
                    <button
                      type="button"
                      disabled
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-not-allowed ${
                        loginMethod === "phone"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-400"
                      }`}
                    >
                      {login?.tabPhone ?? "هاتف"}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">قريباً</span>
                    </button>
                  </div>

                  {loginMethod === "email" ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm">
                          {login?.labelEmail ?? "البريد الإلكتروني"}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={login?.placeholderEmail ?? "example@email.com"}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pr-9 h-9 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm">
                          {login?.labelPassword ?? "كلمة المرور"}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={login?.placeholderPassword ?? "••••••••"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pr-9 pl-9 h-9 text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-3 pb-2 gap-3">
                        <div className="flex items-center gap-2 space-x-reverse">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                            className="w-3.5 h-3.5 shrink-0"
                          />
                          <Label htmlFor="remember" className="cursor-pointer text-xs">
                            {login?.rememberMe ?? "تذكرني"}
                          </Label>
                        </div>
                        <Link href="/forgot-password">
                          <Button variant="link" type="button" className="px-0 text-xs h-auto py-0">
                            {login?.forgotPasswordLink ?? "نسيت كلمة المرور؟"}
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : phoneStep === "phone" ? (
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm">
                        {login?.labelPhone ?? "رقم الهاتف"}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={login?.placeholderPhone ?? "+216 XX XXX XXX"}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pr-9 h-9 text-sm"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-500 pt-0.5">
                        {login?.otpHint ?? "سنرسل لك رمز تحقق (OTP) عبر الرسائل القصيرة"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-sm">{login?.labelPhone ?? "رقم الهاتف"}</Label>
                        <p className="text-sm text-slate-600">{formData.phone || "—"}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs h-auto py-0 px-0"
                          onClick={() => { setPhoneStep("phone"); setOtpValue(""); }}
                        >
                          {login?.changeNumber ?? "تغيير الرقم"}
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">{login?.labelOtp ?? "رمز التحقق (OTP)"}</Label>
                        <div className="flex justify-center py-2">
                          <InputOTP
                            maxLength={OTP_LENGTH}
                            value={otpValue}
                            onChange={setOtpValue}
                          >
                            <InputOTPGroup className="gap-1">
                              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                                <InputOTPSlot key={i} index={i} />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-9 text-sm"
                    disabled={
                      loginMutation.isPending ||
                      (loginMethod === "phone" && phoneStep === "otp" && otpValue.length !== OTP_LENGTH)
                    }
                  >
                    {loginMutation.isPending
                      ? "جاري تسجيل الدخول…"
                      : loginMethod === "phone" && phoneStep === "phone"
                        ? (sendingOtp ? (login?.sendingOtp ?? "جاري الإرسال…") : (login?.sendOtp ?? "إرسال الرمز"))
                        : (login?.submitLogin ?? "تسجيل الدخول")}
                  </Button>
                </form>

                <div className="text-center text-xs text-muted-foreground pt-1">
                  {login?.noAccount ?? "ليس لديك حساب؟"}{" "}
                  <Link href="/register">
                    <Button variant="link" className="px-0 font-semibold h-auto text-xs py-0">
                      {login?.registerLink ?? "سجل الآن"}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Side - Visual/Info */}
              <div className="hidden md:flex bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 text-white h-full" dir="rtl">
                <div className="space-y-4 flex flex-col justify-center w-full text-right">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center ml-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-right">
                    {login?.welcomeTitle ?? "مرحباً بك مرة أخرى"}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed text-right">
                    {login?.welcomeSubtitle ?? "سجل الدخول للوصول إلى لوحة التحكم الخاصة بك وإدارة تقاريرك ونقاطك"}
                  </p>
                  <div className="space-y-2.5 pt-2 w-full">
                    {(login?.bullets ?? ["إدارة التقارير بسهولة", "تتبع النقاط والإحالات", "وصول آمن ومحمي"]).map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2 w-full" dir="rtl">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-slate-300 text-right flex-1">{bullet}</span>
                      </div>
                    ))}
                  </div>
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

