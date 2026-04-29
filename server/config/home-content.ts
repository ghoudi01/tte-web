/**
 * Dynamic home page content. Served via automation.getHomeContent.
 * All home sections read from this config so the site is fully dynamic.
 */

export const homeContent = {
  hero: {
    title: "توقف عن شحن الطلبات التي ستفشل",
    titleHighlight: "التي ستفشل",
    subtitle:
      "محرك الثقة التونسي يساعدك على كشف الطلبات عالية المخاطر قبل الشحن عبر الذكاء الاصطناعي والتحقق الذكي.",
    quickStats: [
      { label: "انخفاض RTO", value: "حتى 35%", iconKey: "TrendingDown" },
      { label: "تأكيد أسرع", value: "خلال دقائق", iconKey: "Truck" },
      { label: "تحسن التدفق النقدي", value: "+22%", iconKey: "Wallet" },
    ],
  },
  nav: {
    sectionLinks: [
      { id: "problem", label: "المشكلة" },
      { id: "solution", label: "الحل" },
      { id: "how-it-works", label: "كيف يعمل" },
      { id: "roadmap", label: "الأفكار القادمة" },
      { id: "contact", label: "تواصل" },
    ],
    brandName: "Tunisia Trust Engine",
    brandTagline: "AI-Powered Risk Scoring",
  },
  socialProof: {
    stats: [
      { value: "250+", label: "علامة تجارية" },
      { value: "15M+", label: "طلب معالج" },
      { value: "40%", label: "تقليل RTO" },
    ],
    tagline: "مصمم خصيصاً للأسواق التي تهيمن عليها الدفع عند الاستلام",
    subline:
      "مبني لتونس والأسواق المماثلة • برنامج تجريبي متاح للمتبنين الأوائل",
  },
  problem: {
    title: "الدفع عند الاستلام يكلف التجار",
    titleHighlight: "الملايين كل عام",
    subtitle:
      "كل طلب فاشل يعني خسارة المنتج، تكاليف الشحن، والوقت الضائع",
    failureRate: "30%",
    failureRateLabel: "معدل الفشل",
    failureCardText: "طلبات فاشلة تؤدي إلى خسائر كبيرة",
    stats: [
      { value: "30%", label: "طلبات فاشلة", iconKey: "XCircle" },
      { value: "15-20%", label: "خسائر تشغيلية", iconKey: "TrendingDown" },
      { value: "40%", label: "تقليل التدفق النقدي", iconKey: "AlertTriangle" },
    ],
  },
  solution: {
    title: "تعرف على محرك الثقة التونسي",
    subtitle:
      "نظام ذكاء اصطناعي يمنع الطلبات السيئة، ولا يمنع العملاء الجيدين",
    highlightText:
      "خوارزميات متقدمة تحلل 300+ معامل في أقل من 200 مللي ثانية لتحديد مستوى المخاطرة",
    trustScoreTitle: "مثال: درجة الثقة",
    trustScoreExamples: [
      { score: 85, label: "عميل موثوق", action: "شحن مباشر" },
      { score: 60, label: "متوسط المخاطرة", action: "طلب تأكيد" },
      { score: 30, label: "عالي المخاطرة", action: "طلب دفع جزئي" },
    ],
  },
  howItWorks: {
    title: "كيف يعمل النظام",
    subtitle: "عملية بسيطة في 4 خطوات",
    steps: [
      { num: "1", label: "وضع الطلب", desc: "المشتري يضع طلباً", iconKey: "Package" },
      { num: "2", label: "حساب درجة الثقة", desc: "نظامنا يحسب فوراً", iconKey: "BarChart3" },
      { num: "3", label: "إجراء ذكي", desc: "AI يحدد الإجراء", iconKey: "Shield" },
      { num: "4", label: "شحن أو تحقق", desc: "شحن مباشر أو تأكيد", iconKey: "CheckCircle2" },
    ],
  },
  benefits: {
    title: "الفوائد الرئيسية",
    subtitle: "قيمة حقيقية للتجار وشركات الشحن",
    forMerchantsTitle: "للتجار",
    forMerchants: [
      "تقليل الارتجاع وخصم التكاليف",
      "تحسين التدفق النقدي",
      "قرار شحن أسرع وواضح",
    ],
    forCarriersTitle: "لشركات الشحن",
    forCarriers: [
      "تقليل الطلبات الفاشلة",
      "معلومات مخاطر مسبقة",
      "تكامل سهل مع المنصات",
    ],
  },
  integrations: {
    title: "تكامل سريع وسهل",
    subline: "API-first • جاهز للاستخدام • تكامل سريع",
    items: [
      {
        title: "API-First",
        description: "تكامل برمجي سهل مع أي منصة تجارة إلكترونية",
        iconKey: "Code",
      },
      {
        title: "جاهز للاستخدام",
        description:
          "تكامل مباشر مع Shopify و WooCommerce والمنصات الرئيسية",
        iconKey: "Plug",
      },
      {
        title: "تكامل سريع",
        description: "كل الأنظمة تعمل خلال 36 ساعة من إتمام الصفقة",
        iconKey: "Zap",
      },
    ],
  },
  shippingSection: {
    badge: "تكاملات شركات الشحن في تونس",
    title: "اربط TTE مع شركات الشحن بسهولة",
    subtitle:
      "اختر شركة الشحن الأنسب لكل طلب حسب المخاطر والمنطقة لرفع نسبة التسليم.",
    ctaLabel: "طلب الربط",
  },
  features: [
    {
      key: "whatsapp_validation",
      title: "التحقق عبر واتساب",
      summary: "تأكيد أسرع للطلبات قبل الشحن بصياغة جاهزة.",
      deliverables: ["قوالب محادثة", "تأكيد تلقائي", "تقليل فشل التواصل"],
    },
    {
      key: "shipping_recommendation",
      title: "توصية شركة الشحن",
      summary: "اختيار الناقل الأنسب حسب المنطقة ونسبة النجاح.",
      deliverables: ["تقييم الأداء", "اختيار تلقائي", "تقليل RTO"],
    },
    {
      key: "trust_explainability",
      title: "شرح سبب درجة الثقة",
      summary: "عرض عوامل القرار قبل اعتماد الطلب.",
      deliverables: ["أسباب واضحة", "إجراء مقترح", "قرار أسرع"],
    },
    {
      key: "growth_loops",
      title: "تجارب نمو أسبوعية",
      summary: "اقتراح تحسينات عملية أسبوعياً.",
      deliverables: ["خطة أسبوعية", "قياس الأثر", "تحسين مستمر"],
    },
  ],
  shippingPartners: [
    { name: "Rapid-Poste", focus: "تغطية وطنية", status: "available" },
    { name: "Aramex Tunisia", focus: "شحن محلي + دولي", status: "available" },
    {
      name: "Tunisia Express",
      focus: "توصيل سريع داخل المدن",
      status: "pilot",
    },
    {
      name: "Intigo",
      focus: "خدمات لوجستية للتجارة الإلكترونية",
      status: "pilot",
    },
  ],
  cta: {
    title: "توقف عن شحن الطلبات التي ستفشل",
    subtitle:
      "ابدأ اليوم وقلل معدلات الارتجاع بنسبة تصل إلى 40% باستخدام الذكاء الاصطناعي",
    primaryLabel: "طلب عرض توضيحي",
    primaryTarget: "contact",
    secondaryLabel: "الانضمام للبرنامج التجريبي",
    secondaryTarget: "pilot",
  },
  footer: {
    brandName: "Tunisia Trust Engine",
    tagline: "AI-Powered Risk Scoring",
    description:
      "نظام ذكاء اصطناعي متقدم لتقليل معدلات الارتجاع في التجارة الإلكترونية التونسية.",
    email: "info@tunisiatrustengine.tn",
    phone: "+21612345678",
    location: "تونس",
    productLinks: [
      { label: "الحل", targetId: "solution" },
      { label: "كيف يعمل", targetId: "how-it-works" },
      { label: "الفوائد", targetId: "benefits" },
    ],
    companyLinks: [
      { label: "المشكلة", targetId: "problem" },
      { label: "عن المشروع", targetId: "" },
      { label: "الأخبار", targetId: "" },
      { label: "اتصل بنا", targetId: "contact" },
    ],
    copyright: "© 2026 Tunisia Trust Engine. جميع الحقوق محفوظة.",
    privacyLabel: "سياسة الخصوصية",
    termsLabel: "شروط الاستخدام",
  },
} as const;
