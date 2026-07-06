import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "./home/components/Navigation";
import { Footer } from "./home/components/Footer";

const content: Record<string, { title: string; updated: string; intro: string; how: string; email: string; note: string }> = {
  ar: {
    title: "حذف البيانات",
    updated: "آخر تحديث: يوليو 2026",
    intro: "نحن في يقين نلتزم بحماية خصوصية مستخدمينا. إذا كنت ترغب في حذف بياناتك الشخصية من نظامنا، يمكنك طلب ذلك عبر البريد الإلكتروني.",
    how: "كيفية طلب حذف البيانات",
    email: "أرسل طلبك إلى: privacy@yaqueen.tn",
    note: "بعد استلام طلبك، سنقوم بمعالجته خلال 30 يوماً. سيتم حذف جميع بياناتك بما في ذلك سجل الطلبات والمعلومات الشخصية المرتبطة بحسابك.",
  },
  fr: {
    title: "Suppression des données",
    updated: "Dernière mise à jour : juillet 2026",
    intro: "Chez Yaqueen, nous nous engageons à protéger la vie privée de nos utilisateurs. Si vous souhaitez supprimer vos données personnelles de notre système, vous pouvez le demander par e-mail.",
    how: "Comment demander la suppression des données",
    email: "Envoyez votre demande à : privacy@yaqueen.tn",
    note: "Après réception de votre demande, nous la traiterons dans un délai de 30 jours. Toutes vos données, y compris l'historique des commandes et les informations personnelles liées à votre compte, seront supprimées.",
  },
  en: {
    title: "Data Deletion",
    updated: "Last updated: July 2026",
    intro: "At Yaqueen, we are committed to protecting your privacy. If you wish to delete your personal data from our system, you can request it via email.",
    how: "How to request data deletion",
    email: "Send your request to: privacy@yaqueen.tn",
    note: "Once we receive your request, we will process it within 30 days. All your data including order history and personal information linked to your account will be deleted.",
  },
};

export default function DeleteData() {
  const { lang, dir } = useLanguage();
  const c = content[lang] ?? content.en;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{c.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{c.updated}</p>
            </CardHeader>
            <CardContent className="max-w-none space-y-6 text-muted-foreground">
              <p className="leading-relaxed">{c.intro}</p>

              <section>
                <h2 className="text-xl font-semibold mt-6 mb-2 text-foreground">{c.how}</h2>
                <p>{c.email}</p>
              </section>

              <section>
                <p className="text-sm bg-muted p-4 rounded-lg">{c.note}</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
