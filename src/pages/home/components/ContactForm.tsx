import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, User, MessageSquare, Send, Phone, Building, FileText, Globe, Package } from "lucide-react";
import { toast } from "sonner";
import { isValidTunisiaPhone } from "@/lib/phone";
import { trpc } from "@/lib/trpc";
import { fadeInUp, scaleIn } from "./animations";

export function ContactForm() {
  const { data: homeContent } = trpc.automation.getHomeContent.useQuery();
  const support = homeContent?.support;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    subject: "",
    monthlyOrders: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTunisiaPhone(formData.phone)) {
      toast.error("رقم الهاتف غير صحيح. الرجاء إدخال رقم تونسي صالح.");
      return;
    }
    console.log("Form submitted:", formData);
  };

  const isValidPhone = formData.phone === "" || isValidTunisiaPhone(formData.phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="pt-4 pb-12 md:pt-6 md:pb-16 bg-gradient-to-br from-white via-slate-50/30 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-12"
          dir="rtl"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            {support?.title ?? "التواصل معنا"}
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            {support?.subtitle ?? "تواصل معنا لأي استفسارات أو أسئلة"}
          </p>
        </motion.div>
        
        <motion.form 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl p-6 md:p-8 border-2 border-slate-200 shadow-xl"
          dir="rtl"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="أدخل اسمك الكامل"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600" />
                رقم الهاتف *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  !isValidPhone
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-slate-200 focus:ring-teal-500 focus:border-teal-500"
                }`}
                placeholder="+216 XX XXX XXX"
                dir="ltr"
              />
              {!isValidPhone && (
                <p className="text-xs text-red-500 mt-1">الرجاء إدخال رقم تونسي صالح (8 أرقام).</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                الشركة / المؤسسة
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="اسم الشركة أو المؤسسة"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" />
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="https://example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-600" />
                عدد الطلبات الشهرية
              </label>
              <select
                name="monthlyOrders"
                value={formData.monthlyOrders}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                dir="rtl"
              >
                <option value="">اختر العدد</option>
                <option value="0-100">أقل من 100 طلب</option>
                <option value="100-500">100 - 500 طلب</option>
                <option value="500-1000">500 - 1,000 طلب</option>
                <option value="1000-5000">1,000 - 5,000 طلب</option>
                <option value="5000+">أكثر من 5,000 طلب</option>
              </select>
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              موضوع الاستفسار
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              dir="rtl"
            >
              <option value="">اختر الموضوع</option>
              <option value="pricing">الاستفسار عن الأسعار</option>
              <option value="integration">التكامل مع النظام</option>
              <option value="demo">طلب عرض تجريبي</option>
              <option value="support">الدعم الفني</option>
              <option value="partnership">شراكة تجارية</option>
              <option value="other">أخرى</option>
            </select>
          </div>
          
          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              الرسالة *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
              placeholder="أخبرنا عن احتياجاتك أو استفساراتك بالتفصيل..."
              dir="rtl"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 py-4 font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            إرسال الرسالة
          </Button>
        </motion.form>
      </div>
    </section>
  );
}

