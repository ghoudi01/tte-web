import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, AlertTriangle, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

export default function Support() {
  const { t, dir } = useLanguage();
  const [location, setLocation] = useLocation();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [reportForm, setReportForm] = useState({ subject: "", description: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const tabFromPath = location === "/support/contact" ? "contact" : location === "/support/report" ? "report" : "contact";

  const contactMutation = trpc.helpDesk.submitContact.useMutation({
    onSuccess: () => { setContactSubmitted(true); toast.success(t("support.success")); },
    onError: () => toast.error(t("common.error")),
  });

  const reportMutation = trpc.helpDesk.submitProblem.useMutation({
    onSuccess: () => { setReportSubmitted(true); toast.success(t("support.success")); },
    onError: () => toast.error(t("common.error")),
  });

  return (
    <div className="space-y-6" dir={dir}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("support.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("support.subtitle")}</p>
      </div>

      <Tabs value={tabFromPath} onValueChange={v => setLocation(v === "contact" ? "/support/contact" : "/support/report")} className="space-y-4" dir={dir}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex" dir={dir}>
            <TabsTrigger value="contact" className="gap-2"><Mail className="w-4 h-4" />{t("support.contact")}</TabsTrigger>
            <TabsTrigger value="report" className="gap-2"><AlertTriangle className="w-4 h-4" />{t("support.reportProblem")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="contact">
          {contactSubmitted ? (
            <Card className="shadow-sm border-0 dark:bg-card bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardContent className="pt-8 pb-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-xl font-bold text-foreground">{t("support.success")}</p>
                <p className="text-sm text-muted-foreground mt-2 mb-6">{t("support.successDesc")}</p>
                <Button variant="outline" onClick={() => { setContactSubmitted(false); setContactForm({ name: "", email: "", message: "" }); }}>
                  {t("support.sendAnother")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border-0 dark:bg-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-500" />{t("support.contact")}</CardTitle>
                <CardDescription>{t("support.contactDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("support.name")}</Label>
                  <Input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder={t("support.name")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("support.email")}</Label>
                  <Input type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>{t("support.message")}</Label>
                  <Textarea rows={5} value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder={t("support.message")} />
                </div>
                <Button onClick={() => contactMutation.mutate(contactForm)} disabled={!contactForm.name || !contactForm.email || !contactForm.message || contactMutation.isPending}
                  className="w-full sm:w-auto gap-2 min-w-[120px] bg-accent text-accent-foreground hover:bg-accent/90">
                  {contactMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" />{t("common.submit")}</>}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="report">
          {reportSubmitted ? (
            <Card className="shadow-sm border-0 dark:bg-card bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardContent className="pt-8 pb-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-xl font-bold text-foreground">{t("support.success")}</p>
                <p className="text-sm text-muted-foreground mt-2 mb-6">{t("support.successDesc")}</p>
                <Button variant="outline" onClick={() => { setReportSubmitted(false); setReportForm({ subject: "", description: "" }); }}>
                  {t("support.sendAnother")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm border-0 dark:bg-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />{t("support.reportProblem")}</CardTitle>
                <CardDescription>{t("support.reportDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("support.subject")}</Label>
                  <Input value={reportForm.subject} onChange={e => setReportForm(f => ({ ...f, subject: e.target.value }))} placeholder={t("support.subject")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("support.description")}</Label>
                  <Textarea rows={5} value={reportForm.description} onChange={e => setReportForm(f => ({ ...f, description: e.target.value }))} placeholder={t("support.description")} />
                </div>
                <Button onClick={() => reportMutation.mutate(reportForm)} disabled={!reportForm.subject || !reportForm.description || reportMutation.isPending}
                  className="w-full sm:w-auto gap-2 min-w-[120px] bg-accent text-accent-foreground hover:bg-accent/90">
                  {reportMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" />{t("common.submit")}</>}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
