import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background" dir={dir}>
      <Card className="w-full max-w-lg mx-4 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-destructive" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-xl font-semibold text-foreground/80 mb-4">{t("notFound.title")}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">{t("notFound.description")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setLocation("/")} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              <Home className="w-4 h-4 ms-2" />{t("notFound.goHome")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
