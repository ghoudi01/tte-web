import { Mail, Phone, Lock, Eye, EyeOff, User, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface Step1PersonalProps {
  formData: any;
  setFormData: (data: any) => void;
  isValidEmail: boolean;
  isValidPhone: boolean;
  passwordsMatch: boolean;
  passwordStrength: number;
  passwordStrengthLabels: string[];
  registerLabels: any;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
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
              className={`pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${!isValidEmail && formData.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
            className={`pr-10 h-11 text-sm border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${!isValidPhone && formData.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
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
                {(registerLabels?.passwordStrength ?? "قوة كلمة المرور:")} {passwordStrengthLabels[passwordStrength - 1] || passwordStrengthLabels[0]}
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
  );
}
