import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: appContent } = trpc.automation.getAppContent.useQuery();
  const fp = appContent?.forgotPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(fp?.errorMessage ?? "يرجى إدخال البريد الإلكتروني");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(fp?.successMessage ?? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك");
      setIsSubmitting(false);
      setLocation("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" dir="rtl">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-2 md:p-4 min-h-0">
        <Card className="w-full max-w-md shadow-lg border">
          <CardHeader>
            <CardTitle className="text-2xl" dir="rtl">
              {fp?.title ?? "نسيت كلمة المرور؟"}
            </CardTitle>
            <CardDescription dir="rtl">
              {fp?.description ?? "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور"}
            </CardDescription>
          </CardHeader>
          <CardContent dir="rtl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{fp?.labelEmail ?? "البريد الإلكتروني"}</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (fp?.sendingText ?? "جاري الإرسال...") : (fp?.submitButton ?? "إرسال")}
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link href="/login">
                <Button variant="link" className="px-0 h-auto text-sm">
                  {fp?.backToLogin ?? "العودة لتسجيل الدخول"}
                </Button>
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
