import { Mail, Phone, Lock, Eye, EyeOff, User, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step1PersonalProps {
  formData: any;
  setFormData: any;
  isValidEmail: boolean;
  isValidPhone: boolean;
  passwordsMatch: boolean;
  passwordStrength: number;
  passwordStrengthLabels: string[];
  registerLabels?: { passwordStrength?: string };
}

export function Step1Personal({
  formData,
  setFormData,
  isValidEmail,
  isValidPhone,
  passwordsMatch,
  passwordStrength,
  passwordStrengthLabels,
  registerLabels,
}: Step1PersonalProps) {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">{t("register.nameLabel")}</Label>
          <div className="relative">
            <User className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder={t("register.namePlaceholder")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="ps-10 h-11 text-sm border-border focus:border-primary focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">{t("register.emailLabel")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              dir="ltr"
              className={`h-11 ps-10 pe-10 text-sm border-border focus:border-primary focus:ring-primary ${!isValidEmail && formData.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              required
            />
            {formData.email && (
              <div className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2">
                {isValidEmail ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                )}
              </div>
            )}
          </div>
          {!isValidEmail && formData.email && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{t("register.emailError")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-foreground">{t("register.phoneLabel")}</Label>
        <div className="relative">
          <Phone className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+216 XX XXX XXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            dir="ltr"
            className={`h-11 ps-10 pe-10 text-sm border-border focus:border-primary focus:ring-primary ${!isValidPhone && formData.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            required
          />
          {formData.phone && (
            <div className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2">
              {isValidPhone ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
              )}
            </div>
          )}
        </div>
        {!isValidPhone && formData.phone && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {t("register.phoneError")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">{t("register.passwordLabel")}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="ps-10 h-11 text-sm border-border focus:border-primary focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                passwordStrength <= 1 ? "text-red-500 dark:text-red-400" :
                passwordStrength <= 2 ? "text-orange-500 dark:text-orange-400" :
                passwordStrength <= 3 ? "text-yellow-500 dark:text-yellow-400" :
                passwordStrength <= 4 ? "text-blue-500 dark:text-blue-400" : "text-green-600 dark:text-green-400"
              }`}>
                {(registerLabels?.passwordStrength ?? t("register.passwordStrength"))} {passwordStrengthLabels[passwordStrength - 1] || passwordStrengthLabels[0]}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">{t("register.confirmPasswordLabel")}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`ps-10 h-11 text-sm border-border focus:border-primary focus:ring-primary ${!passwordsMatch && formData.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute end-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {formData.confirmPassword && (
              <div className="absolute end-10 top-1/2 transform -translate-y-1/2">
                {passwordsMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                )}
              </div>
            )}
          </div>
          {!passwordsMatch && formData.confirmPassword && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{t("register.passwordMismatch")}</p>
          )}
        </div>
      </div>
    </>
  );
}
