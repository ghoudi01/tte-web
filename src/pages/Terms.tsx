import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

export default function Terms() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t("terms.title")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("terms.lastUpdated")}</p>
            </CardHeader>
            <CardContent className="max-w-none space-y-6 text-muted-foreground">
              <p className="leading-relaxed">{t("terms.intro")}</p>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">1. {t("terms.s1Title")}</h2>
                <p>{t("terms.s1Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">2. {t("terms.s2Title")}</h2>
                <p>{t("terms.s2Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">3. {t("terms.s3Title")}</h2>
                <p>{t("terms.s3Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">4. {t("terms.s4Title")}</h2>
                <p>{t("terms.s4Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">5. {t("terms.s5Title")}</h2>
                <p>{t("terms.s5Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">6. {t("terms.s6Title")}</h2>
                <p>{t("terms.s6Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">7. {t("terms.s7Title")}</h2>
                <p>{t("terms.s7Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">8. {t("terms.s8Title")}</h2>
                <p>{t("terms.s8Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">9. {t("terms.s9Title")}</h2>
                <p>{t("terms.s9Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">10. {t("terms.s10Title")}</h2>
                <p>{t("terms.s10Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">11. {t("terms.s11Title")}</h2>
                <p>{t("terms.s11Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">12. {t("terms.s12Title")}</h2>
                <p>{t("terms.s12Content")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">13. {t("terms.s13Title")}</h2>
                <p>{t("terms.s13Content")}</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
