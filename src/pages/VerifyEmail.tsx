import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation, useSearch } from "wouter";
import { MailCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

export default function VerifyEmail() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { t, dir } = useLanguage();
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const token = params.get("token") ?? "";

  const fired = useRef(false);
  const confirm = trpc.auth.confirmEmail.useMutation({
    onSuccess: () => {
      toast.success(t("verifyEmail.successMessage"));
      setLocation("/login");
    },
    onError: (err: any) => toast.error(err.message ?? t("common.error")),
  });

  useEffect(() => {
    if (!token || fired.current) return;
    fired.current = true;
    confirm.mutate({ token });
  }, [token]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4 pt-16 bg-gradient-to-br from-muted/30 to-muted/10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <MailCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-card-foreground text-xl">{t("verifyEmail.title")}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {token
                ? t("verifyEmail.verifying")
                : t("verifyEmail.noToken")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">{t("verifyEmail.backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
