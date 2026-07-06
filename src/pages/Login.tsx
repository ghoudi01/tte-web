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
import { SESSION_STORAGE_TOKEN_KEY } from "@/constants/auth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

const OTP_LENGTH = 6;

export default function Login() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: oauthLinks } = trpc.auth.oauthLinks.useQuery();
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data: { sessionToken: string; me: { id: string; displayName?: string | null; email?: string | null; role?: string } }) => {
      sessionStorage.setItem(SESSION_STORAGE_TOKEN_KEY, data.sessionToken);
      utils.auth.me.setData(undefined, data.me);
      setLocation("/dashboard");
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? t("login.error"));
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
    toast.info(t("login.phoneOtpComingSoon"));
    setSendingOtp(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone") {
      if (phoneStep === "phone") {
        handleSendOtp(e);
        return;
      }
      if (otpValue.length !== OTP_LENGTH) return;
      toast.info(t("login.phoneOtpComingSoon"));
      return;
    }
    loginMutation.mutate({ email: formData.email, password: formData.password });
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col`} dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center p-2 md:p-4 min-h-0 pt-20 md:pt-24">
        <div className="w-full max-w-6xl h-full flex items-center">
          <div className="bg-card rounded-lg shadow-lg border border-border p-4 md:p-6 w-full">
            <div className="grid md:grid-cols-2 gap-6 items-stretch w-full">
              <div className="space-y-3 flex flex-col justify-center" dir={dir}>
                <div>
                  {oauthLinks?.google ? (
                    <div className="mb-4">
                      <Button variant="outline" className="w-full" asChild>
                        <a href={oauthLinks.google}>{t("login.google")}</a>
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-2">{t("login.google")}</p>
                    </div>
                  ) : null}
                  <h1 className="text-2xl font-bold text-card-foreground mb-1">
                    {t("login.title")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t("login.subtitle")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-1.5 p-0.5 bg-muted rounded-md">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("email");
                        setPhoneStep("phone");
                        setOtpValue("");
                      }}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                        loginMethod === "email"
                          ? "bg-card text-card-foreground shadow-sm"
                          : "text-muted-foreground hover:text-card-foreground"
                      }`}
                    >
                      {t("contact.email")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod("phone")}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                        loginMethod === "phone"
                          ? "bg-card text-card-foreground shadow-sm"
                          : "text-muted-foreground hover:text-card-foreground"
                      }`}
                    >
                      {t("contact.phone")}
                    </button>
                  </div>

                  {loginMethod === "email" ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm">
                          {t("contact.email")}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute start-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("login.placeholderEmail")}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="ps-9 h-9 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm">
                          {t("login.labelPassword")}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute start-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("login.placeholderPassword")}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="ps-9 h-9 text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute end-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-3 pb-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                            className="w-3.5 h-3.5 shrink-0"
                          />
                          <Label htmlFor="remember" className="cursor-pointer text-xs">
                            {t("login.rememberMe")}
                          </Label>
                        </div>
                        <Link href="/forgot-password">
                          <Button variant="link" type="button" className="px-0 text-xs h-auto py-0 text-accent dark:text-blue-400">
                            {t("login.forgotPassword")}
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : phoneStep === "phone" ? (
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm">
                        {t("contact.phone")}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute start-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t("login.placeholderPhone")}
                          value={formData.phone}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val && !val.startsWith("+")) {
                              val = "+216" + val.replace(/[^0-9]/g, "");
                            }
                            setFormData({ ...formData, phone: val });
                          }}
                          className="ps-9 h-9 text-sm"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground pt-0.5">
                        {t("login.otpHint")}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-sm">{t("contact.phone")}</Label>
                        <p className="text-sm text-muted-foreground">{formData.phone || "—"}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs h-auto py-0 px-0"
                          onClick={() => { setPhoneStep("phone"); setOtpValue(""); }}
                        >
                          {t("login.changeNumber")}
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">{t("login.labelOtp")}</Label>
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
                    className="w-full h-9 text-sm bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={
                      loginMutation.isPending ||
                      (loginMethod === "phone" && phoneStep === "otp" && otpValue.length !== OTP_LENGTH)
                    }
                  >
                    {loginMutation.isPending
                      ? t("login.sendingOtp")
                      : loginMethod === "phone" && phoneStep === "phone"
                        ? (sendingOtp ? t("login.sendingOtp") : t("login.sendOtp"))
                        : t("nav.login")}
                  </Button>
                </form>

                <div className="text-center text-xs text-muted-foreground pt-1">
                  {t("login.noAccount")} {" "}
                  <Link href="/register">
                    <Button variant="link" className="px-0 font-semibold h-auto text-xs py-0 text-accent dark:text-blue-400">
                      {t("nav.register")}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 text-primary-foreground h-full" dir={dir}>
                <div className="space-y-4 flex flex-col justify-center w-full">
                  <div className="w-12 h-12 bg-primary-foreground/10 rounded-lg flex items-center justify-center ltr:me-auto rtl:ms-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">
                    {t("login.welcomeTitle")}
                  </h2>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">
                    {t("login.welcomeSubtitle")}
                  </p>
                  <div className="space-y-2.5 pt-2 w-full">
                    {[t("nav.dashboard"), t("sidebar.credits"), t("sidebar.settings")].map((bullet: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 w-full" dir={dir}>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-primary-foreground/80">{bullet}</span>
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
