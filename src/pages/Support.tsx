import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Mail, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const faqItems = [
  { q: "كيف أتحقق من رقم هاتف؟", a: "اذهب إلى التحقق من الهاتف وأدخل رقم الهاتف. ستحصل على درجة الثقة ومستوى المخاطرة." },
  { q: "كيف أحول نقاطي إلى أموال؟", a: "من صفحة النقاط اختر تحويل النقاط وأدخل المبلغ. الحد الأدنى 100 نقطة." },
  { q: "كيف أستخدم رابط الإحالة؟", a: "انسخ الرابط من صفحة الإحالات وشاركه. تحصل على نقاط عند تسجيل المستخدمين الجدد." },
];

export default function Support() {
  const [location, setLocation] = useLocation();
  const { data: appContent, isLoading } = trpc.automation.getAppContent.useQuery();
  const c = appContent?.support;
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const tabFromPath =
    location === "/support/contact" ? "contact" : "help";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال رسالتك. سنرد في أقرب وقت.");
    setContactForm({ name: "", email: "", message: "" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{c?.pageTitle ?? "الدعم"}</h1>
          <p className="text-lg text-slate-600">{c?.pageSubtitle ?? "اتصل بنا أو أبلغ عن مشكلة"}</p>
        </div>
        <Tabs
          value={tabFromPath}
          onValueChange={(v) => setLocation(v === "help" ? "/support" : `/support/${v}`)}
          dir="rtl"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="help">مركز المساعدة</TabsTrigger>
            <TabsTrigger value="contact">اتصل بنا</TabsTrigger>
          </TabsList>
          <TabsContent value="help" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  الأسئلة الشائعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4" dir="rtl">
                    <h3 className="font-semibold text-slate-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-slate-600">{item.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  اتصل بنا
                </CardTitle>
                <CardDescription>أرسل استفسارك وسنرد في أقرب وقت</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4" dir="rtl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">الاسم</Label>
                      <Input
                        id="contactName"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="الاسم الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactMessage">الرسالة</Label>
                    <Textarea
                      id="contactMessage"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="اكتب رسالتك..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit">إرسال</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
