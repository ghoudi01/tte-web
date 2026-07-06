import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { t, dir } = useLanguage();
  const [email, setEmail] = useState("");

  const resetReq = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      toast.success(t("forgotPassword.successMessage"));
      setLocation("/login");
    },
    onError: (err: { message?: string }) => toast.error(err.message ?? t("common.error")),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t("forgotPassword.errorMessage"));
      return;
    }
    resetReq.mutate({ email: email.trim() });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-card-foreground">
                {t("forgotPassword.title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("forgotPassword.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">{t("contact.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={fp?.placeholderEmail ?? "example@email.com"}
                      className="ps-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={resetReq.isPending}
                >
                  {resetReq.isPending
                    ? t("forgotPassword.sending")
                    : t("forgotPassword.submitLabel")}
                </Button>
              </form>
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <Link href="/login">
                  <Button variant="link" className="px-0 font-semibold h-auto text-xs py-0">
                    <ArrowRight className="w-3 h-3 ms-1 rtl:rotate-180" />
                    {t("forgotPassword.backToLogin")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
