import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { t, dir } = useLanguage();
  const token = useMemo(() => {
    const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    return q.get("token") ?? "";
  }, [search]);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success(t("resetPassword.successMessage"));
      setLocation("/login");
    },
    onError: (err: any) => toast.error(err.message ?? t("common.error")),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t("resetPassword.shortPassword"));
      return;
    }
    if (password !== password2) {
      toast.error(t("resetPassword.passwordMismatch"));
      return;
    }
    if (!token) {
      toast.error(t("resetPassword.invalidToken"));
      return;
    }
    resetMutation.mutate({ token, newPassword: password });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-muted/30 to-muted/10">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Lock className="w-6 h-6" />
              {t("resetPassword.title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">{t("resetPassword.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pw" className="text-card-foreground">{t("resetPassword.passwordLabel")}</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw2" className="text-card-foreground">{t("resetPassword.confirmLabel")}</Label>
                <Input
                  id="pw2"
                  type="password"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  required
                  minLength={6}
                 
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={resetMutation.isPending}>
                {resetMutation.isPending ? t("contact.sending") : t("common.save")}
              </Button>
            </form>
            <p className="text-center mt-4">
              <Link href="/login">
                <Button variant="link" className="px-0 text-muted-foreground">
                  {t("resetPassword.backToLogin")}
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
