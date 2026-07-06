import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeUp, stagger } from "./animations";

export function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const mutation = trpc.helpDesk.submitPublicContact.useMutation({
    onSuccess: () => {
      toast.success(t("contact.success"));
      setForm({ name: "", email: "", message: "" });
    },
    onError: (err: any) => toast.error(err.message ?? t("contact.error")),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() });
  };

  return (
    <section id="contact" className="py-14 md:py-20 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
            className="text-center mb-10"
          >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3">
            {t("home.contact.title1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              {t("home.contact.titleHighlight")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("home.contact.subtitle")}
          </p>
        </motion.div>

        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          onSubmit={handleSubmit}
          className="w-full bg-card/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-xl"
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div variants={fadeUp}>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-accent" /> {t("home.contact.nameLabel")}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-background/50 border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 placeholder:text-muted-foreground/50"
                  placeholder={t("home.contact.namePlaceholder")}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-accent" /> {t("home.contact.emailLabel")}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-background/50 border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 placeholder:text-muted-foreground/50"
                  placeholder={t("home.contact.emailPlaceholder")}
                />
              </motion.div>
            </div>

            <motion.div variants={fadeUp}>
              <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-accent" /> {t("home.contact.messageLabel")}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={3}
                className="w-full px-3.5 py-2.5 bg-background/50 border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 placeholder:text-muted-foreground/50 resize-none"
                placeholder={t("home.contact.messagePlaceholder")}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 py-3 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {mutation.isPending ? t("home.contact.sending") : t("home.contact.send")}
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
