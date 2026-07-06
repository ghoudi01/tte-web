import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

export default function Privacy() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t("privacy.title")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("privacy.lastUpdated")}</p>
            </CardHeader>
            <CardContent className="max-w-none space-y-6 text-muted-foreground">
              <p className="leading-relaxed">{t("privacy.intro")}</p>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">1. {t("privacy.s1Title")}</h2>
                <p>{t("privacy.s1Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">2. {t("privacy.s2Title")}</h2>
                <p>{t("privacy.s2Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">3. {t("privacy.s3Title")}</h2>
                <p>{t("privacy.s3Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">4. {t("privacy.s4Title")}</h2>
                <p>{t("privacy.s4Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">5. {t("privacy.s5Title")}</h2>
                <p>{t("privacy.s5Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">6. {t("privacy.s6Title")}</h2>
                <p>{t("privacy.s6Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">7. {t("privacy.s7Title")}</h2>
                <p>{t("privacy.s7Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">8. {t("privacy.s8Title")}</h2>
                <p>{t("privacy.s8Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">9. {t("privacy.s9Title")}</h2>
                <p>{t("privacy.s9Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">10. {t("privacy.s10Title")}</h2>
                <p>{t("privacy.s10Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">11. {t("privacy.s11Title")}</h2>
                <p>{t("privacy.s11Content")}</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
