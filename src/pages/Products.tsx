import { useState, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2, Package, Plus, Pencil, Search, MessageCircle, Bot, ArrowLeft, ArrowRight, ImageIcon, Send, ImagePlus, X, ShoppingBag, CheckCircle2, Ruler, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  fbIgEnabled?: boolean;
  fbIgOptions?: any;
  fbIgQuestions?: any;
  fbProductLink?: string;
  createdAt: string;
  updatedAt: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrls: string[];
  stock: string;
  tags: string;
  variants: { size: string; color: string; price: string; stock: string }[];
  fbIgEnabled: boolean;
  fbProductLink: string;
  botAutoReply: boolean;
  botAutoCall: boolean;
  botAutoReview: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrls: [],
  stock: "",
  tags: "",
  variants: [],
  fbIgEnabled: false,
  fbProductLink: "",
  botAutoReply: false,
  botAutoCall: false,
  botAutoReview: false,
};

const FAKE_CONVERSIONS = [
  {
    id: "conv-1",
    customerName: "أحمد بن علي",
    phoneNumber: "+216 98 123 456",
    createdAt: "2026-07-06T14:30:00Z",
    status: "confirmed",
    trustScore: 88,
    lastMessage: "قداش سوم الصباط وهل فما توصيل لسوسة؟",
    messages: [
      { role: "customer", text: "مرحبا، حبيت نسأل على الصباط هذا", time: "14:20" },
      { role: "bot", text: "👋 أهلاً بك! الصباط متوفر وبجودة عالية. كيف يمكنني مساعدتك؟", time: "14:20" },
      { role: "customer", text: "قداش السوم وهل فما توصيل لسوسة؟", time: "14:21" },
      { role: "bot", text: "💰 سعر المنتج هو 79 د.ت.\n🚚 نعم، متوفر التوصيل لكامل تراب الجمهورية بما في ذلك سوسة بـ 7 د.ت فقط!", time: "14:21" },
      { role: "customer", text: "باهي نحب نشري واحد قياس 42 لون أسود", time: "14:22" },
      { role: "bot", text: "🛍️ رائع! لإتمام الطلب، يرجى تزويدي برقم هاتفك والاسم الكامل.", time: "14:22" },
      { role: "customer", text: "98123456 أحمد بن علي", time: "14:23" },
      { role: "bot", text: "✅ تم تسجيل طلبك بنجاح! رقم الهاتف: +216 98 123 456. سيتم الاتصال بك لتأكيد الشحن.", time: "14:24" },
    ]
  },
  {
    id: "conv-2",
    customerName: "مريم العياري",
    phoneNumber: "+216 55 456 789",
    createdAt: "2026-07-05T09:15:00Z",
    status: "delivered",
    trustScore: 95,
    lastMessage: "تم الاستلام، شكرا جزيلا جودة ممتازة!",
    messages: [
      { role: "customer", text: "مرحبا، فما مقاس 38 من هذا؟", time: "09:02" },
      { role: "bot", text: "👋 أهلاً بك! نعم متوفر مقاس 38 باللون الوردي والأبيض.", time: "09:03" },
      { role: "customer", text: "باهي قداش السوم؟", time: "09:03" },
      { role: "bot", text: "💰 السعر هو 79 د.ت.", time: "09:04" },
      { role: "customer", text: "أوكي نحب نطلب واحد أبيض مقاس 38", time: "09:05" },
      { role: "bot", text: "🛍️ ممتاز! يرجى إرسال رقم الهاتف والمدينة لتسجيل الطلب.", time: "09:05" },
      { role: "customer", text: "هاتفي 55456789 تونس العاصمة", time: "09:06" },
      { role: "bot", text: "✅ تم استلام طلبك! سيتم التواصل معك قريباً لتأكيد التوصيل.", time: "09:07" },
    ]
  },
  {
    id: "conv-3",
    customerName: "ياسين الغربي",
    phoneNumber: "+216 22 789 123",
    createdAt: "2026-07-04T18:22:00Z",
    status: "cancelled",
    trustScore: 32,
    lastMessage: "سومو غالي برشا شكرا",
    messages: [
      { role: "customer", text: "السلام عليكم، قداش السوم؟", time: "18:19" },
      { role: "bot", text: "💰 السعر هو 79 د.ت. متوفر التوصيل لكافة الولايات.", time: "18:20" },
      { role: "customer", text: "سومو غالي برشا شكرا", time: "18:21" },
      { role: "bot", text: "نشكرك على تواصلك معنا، في خدمتكم دائماً!", time: "18:22" },
    ]
  }
];

export default function Products() {
  const { t, dir } = useLanguage();
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formStep, setFormStep] = useState(0);

  const [activeBotProduct, setActiveBotProduct] = useState<Product | null>(null);
  const [selectedFakeConv, setSelectedFakeConv] = useState<any | null>(null);
  const [sellerBotMessages, setSellerBotMessages] = useState<{ role: "bot" | "seller"; text: string }[]>([]);
  const [sellerInput, setSellerInput] = useState("");
  const [extraMessages, setExtraMessages] = useState<{ role: "customer" | "bot"; text: string; time: string }[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, [extraMessages, selectedFakeConv]);

  const ordersQuery = trpc.orders.list.useQuery({});


  const { data: products = [], isLoading, error, refetch } = trpc.products.list.useQuery(undefined, { refetchOnWindowFocus: false });
  const botStatus = trpc.socialSellers.botStatus.useQuery();
  const fbConnected = botStatus.data?.connected === true;
  const productsTyped = products as Product[];

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success(t("products.add"));
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      toast.success(t("products.edit"));
      closeDialog();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filteredProducts = useMemo(() => productsTyped.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.category?.toLowerCase().includes(search.toLowerCase()))
  ), [productsTyped, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pageProducts = filteredProducts.slice(page * pageSize, (page + 1) * pageSize);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setFormStep(0); };

  const closeDialog = () => { setShowProductForm(false); resetForm(); };

  const openCreate = () => { resetForm(); setShowProductForm(true); };

  const openEdit = (product: Product) => {
    const existingImages = (product as any).imageUrls
      ? (product as any).imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [];
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category || "",
      imageUrls: existingImages,
      stock: (product as any).stock != null ? String((product as any).stock) : "",
      tags: (product as any).tags || "",
      variants: (product as any).variants || [],
      fbIgEnabled: product.fbIgEnabled ?? false,
      fbProductLink: (product as any).fbProductLink || "",
      botAutoReply: (product as any).botAutoReply ?? false,
      botAutoCall: (product as any).botAutoCall ?? false,
      botAutoReview: (product as any).botAutoReview ?? false,
    });
    setEditingId(product.id);
    setFormStep(0);
    setShowProductForm(true);
  };

  const handleSubmit = (e?: any) => {
    e?.preventDefault?.();
    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum < 0) { toast.error(t("products.price")); return; }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: form.name,
        description: form.description || undefined,
        price: priceNum,
        category: form.category || undefined,
        imageUrl: form.imageUrls[0] || undefined,
        fbIgEnabled: form.fbIgEnabled,
        fbIgOptions: form.fbIgEnabled
          ? {
              facebookProductLink: form.fbProductLink,
              imageUrls: form.imageUrls,
              stock: form.stock,
              tags: form.tags,
              variants: form.variants,
              botAutoReply: form.botAutoReply,
              botAutoCall: form.botAutoCall,
              botAutoReview: form.botAutoReview,
            }
          : undefined,
      });
    } else {
      createMutation.mutate({
        name: form.name,
        description: form.description || undefined,
        price: priceNum,
        category: form.category || undefined,
        imageUrl: form.imageUrls[0] || undefined,
        fbIgEnabled: form.fbIgEnabled,
        fbIgOptions: form.fbIgEnabled
          ? {
              facebookProductLink: form.fbProductLink,
              imageUrls: form.imageUrls,
              stock: form.stock,
              tags: form.tags,
              variants: form.variants,
              botAutoReply: form.botAutoReply,
              botAutoCall: form.botAutoCall,
              botAutoReview: form.botAutoReview,
            }
          : undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-10 w-64" />
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-xl" />
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">{t("common.error")}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>{t("dashboard.retry")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("products.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("products.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" />{t("products.add")}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder={t("products.search")} className="ps-9" />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="text-center py-16">
            <Package className="w-14 h-14 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{search ? t("common.noData") : t("products.noProducts")}</p>
            {!search && <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}><Plus className="w-4 h-4 ms-1" />{t("products.add")}</Button>}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-t-xl" />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">{t("products.name")}</TableHead>
                    <TableHead className="text-start">{t("products.category")}</TableHead>
                    <TableHead className="text-start">{t("products.price")}</TableHead>
                    <TableHead className="text-center">{t("products.botEnabled")}</TableHead>
                    <TableHead className="text-start">{t("common.edit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                      <TableCell>
                        {product.category ? (
                          <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                        ) : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="font-semibold">{product.price.toFixed(2)} {t("orders.currencyTnd")}</TableCell>
                      <TableCell className="text-center">
                        {fbConnected ? (
                          <div className="flex items-center justify-center gap-1.5" title="الرد التلقائي / الاتصال التلقائي / المراجعة التلقائية">
                            <span className={cn("w-2 h-2 rounded-full inline-block", (product as any).botAutoReply ? "bg-blue-500" : "bg-muted-foreground/20")} />
                            <span className={cn("w-2 h-2 rounded-full inline-block", (product as any).botAutoCall ? "bg-emerald-500" : "bg-muted-foreground/20")} />
                            <span className={cn("w-2 h-2 rounded-full inline-block", (product as any).botAutoReview ? "bg-violet-500" : "bg-muted-foreground/20")} />
                          </div>
                        ) : <span className="text-muted-foreground/20 text-[10px]">—</span>}
                      </TableCell>
                      <TableCell className="text-start">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-accent hover:text-accent/80"
                            disabled={!product.fbIgEnabled}
                            onClick={() => {
                              setActiveBotProduct(product);
                            }}
                            title={product.fbIgEnabled ? "عرض المحادثات" : "المنتج غير مرتبط بفيسبوك"}
                          >
                            <Bot className="w-4.5 h-4.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(product)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground" dir="ltr">
                  {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredProducts.length)} / {filteredProducts.length}
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                  className="text-xs border border-border rounded px-1 py-0.5 bg-background text-foreground"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
                <span className="text-xs text-muted-foreground min-w-[4rem] text-center">{page + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full-page Product Form */}
      {showProductForm && (
        <div className="bg-background fixed inset-0 z-40 flex flex-col" dir={dir}>
          {/* Sticky Header */}
          <div className="shrink-0 px-4 pt-4 pb-3 bg-background border-b">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={closeDialog} className="shrink-0">
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">{editingId ? t("products.edit") : t("products.addNew")}</h1>
                <p className="text-xs text-muted-foreground">{t("products.subtitle")}</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mt-3">
              <div className="flex items-center">
                {[{ icon: Package, label: "المعلومات الأساسية" }, { icon: ShoppingBag, label: "التسعير والتنويعات" }, { icon: ImageIcon, label: "صور المنتج" }, { icon: MessageCircle, label: "إعدادات البوت" }, { icon: CheckCircle2, label: "مراجعة" }].map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === formStep;
                  const isDone = i < formStep;
                  return (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                      <button
                        type="button"
                        onClick={() => i < formStep && setFormStep(i)}
                        className="flex items-center gap-2"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors shrink-0",
                          isDone ? "bg-accent text-accent-foreground" :
                          isActive ? "bg-accent/10 text-accent border-2 border-accent" :
                          "bg-muted text-muted-foreground border border-border"
                        )}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className={cn(
                          "text-xs font-medium hidden sm:inline",
                          isActive ? "text-accent" : isDone ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {s.label}
                        </span>
                      </button>
                      {i < 4 && (
                        <div className={cn("flex-1 h-0.5 mx-2", i < formStep ? "bg-accent" : "bg-border")} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4">
            <div className="space-y-4">
              {/* Step 1: General Info */}
              {formStep === 0 && (
                <Card className="border-t-4 border-t-accent">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Package className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-foreground text-sm">المعلومات الأساسية</span>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="p-name">{t("products.name")} <span className="text-destructive">*</span></Label>
                      <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="p-desc">{t("products.description")}</Label>
                      <Textarea id="p-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder={t("products.description")} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="p-tags">الوسوم</Label>
                        <Input id="p-tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="أحذية, رياضية, رجالية" />
                        <p className="text-[10px] text-muted-foreground">افصل بين الوسوم بفاصلة</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="p-category">{t("products.category")}</Label>
                        <Input id="p-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Pricing & Variations */}
              {formStep === 1 && (
                <Card className="border-t-4 border-t-emerald-500">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <ShoppingBag className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-foreground text-sm">التسعير والتنويعات</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="p-price">{t("products.price")} ({t("orders.currencyTnd")}) <span className="text-destructive">*</span></Label>
                        <Input id="p-price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="p-stock">الكمية المتوفرة</Label>
                        <Input id="p-stock" type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">التنويعات (أحجام / ألوان)</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 h-8"
                          onClick={() => setForm(f => ({ ...f, variants: [...f.variants, { size: "", color: "", price: f.price, stock: "" }] }))}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          إضافة تنويع
                        </Button>
                      </div>

                      {form.variants.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                          لا توجد تنويعات بعد. أضف أحجاماً وألواناً مختلفة.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {form.variants.map((v, i) => (
                            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border">
                              <div className="flex-1 grid grid-cols-4 gap-2">
                                <div>
                                  <Label className="text-[10px]">الحجم</Label>
                                  <select
                                    value={v.size}
                                    onChange={e => {
                                      const copy = [...form.variants];
                                      copy[i] = { ...copy[i], size: e.target.value };
                                      setForm(f => ({ ...f, variants: copy }));
                                    }}
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                                  >
                                    <option value="">اختر</option>
                                    {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-[10px]">اللون</Label>
                                  <Input
                                    value={v.color}
                                    onChange={e => {
                                      const copy = [...form.variants];
                                      copy[i] = { ...copy[i], color: e.target.value };
                                      setForm(f => ({ ...f, variants: copy }));
                                    }}
                                    placeholder="أحمر"
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px]">السعر</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={v.price}
                                    onChange={e => {
                                      const copy = [...form.variants];
                                      copy[i] = { ...copy[i], price: e.target.value };
                                      setForm(f => ({ ...f, variants: copy }));
                                    }}
                                    placeholder="79.00"
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px]">المخزون</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={v.stock}
                                    onChange={e => {
                                      const copy = [...form.variants];
                                      copy[i] = { ...copy[i], stock: e.target.value };
                                      setForm(f => ({ ...f, variants: copy }));
                                    }}
                                    placeholder="0"
                                    className="h-8 text-xs"
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 mt-5 text-muted-foreground hover:text-destructive"
                                onClick={() => setForm(f => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }))}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Media */}
              {formStep === 2 && (
                <Card className="border-t-4 border-t-sky-500">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <ImageIcon className="w-5 h-5 text-sky-500" />
                      <span className="font-semibold text-foreground text-sm">صور المنتج</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" className="gap-2" onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.multiple = true;
                        input.onchange = () => {
                          const files = Array.from(input.files || []);
                          const urls = files.map(f => URL.createObjectURL(f));
                          setForm(f => ({ ...f, imageUrls: [...f.imageUrls, ...urls] }));
                        };
                        input.click();
                      }}>
                        <ImagePlus className="w-4 h-4" />
                        استيراد صور
                      </Button>
                      <span className="text-xs text-muted-foreground">أو اسحب وأفلت الصور هنا</span>
                    </div>

                    {form.imageUrls.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {form.imageUrls.map((url, i) => (
                          <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted/20 shadow-xs">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setForm(f => ({ ...f, imageUrls: f.imageUrls.filter((_, j) => j !== i) }))}
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">لم يتم إضافة أي صور بعد</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Bot Settings */}
              {formStep === 3 && (
                <Card className="border-t-4 border-t-amber-500">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <MessageCircle className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold text-foreground text-sm">إعدادات البوت</span>
                    </div>

                    <div className={cn("flex items-center justify-between rounded-lg border bg-card px-4 py-3", !fbConnected && "opacity-60")}>
                      <div className="flex items-center gap-3">
                        <MessageCircle className={cn("w-4 h-4", fbConnected ? "text-primary" : "text-muted-foreground")} />
                        <div>
                          <p className="text-sm font-medium text-foreground">عرض في البوت</p>
                          <p className="text-xs text-muted-foreground">ربط المنتج بفيسبوك</p>
                        </div>
                      </div>
                      <Switch
                        checked={form.fbIgEnabled}
                        onCheckedChange={(c) => {
                          setForm({ ...form, fbIgEnabled: c });
                          if (!c) setForm(f => ({ ...f, fbProductLink: "" }));
                        }}
                        disabled={!fbConnected}
                      />
                    </div>

                    {form.fbIgEnabled && fbConnected && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">رابط المنتج على فيسبوك</Label>
                        <Input
                          value={form.fbProductLink}
                          onChange={e => setForm({ ...form, fbProductLink: e.target.value })}
                          placeholder="https://facebook.com/..."
                          dir="ltr"
                          className="text-xs h-9"
                        />
                      </div>
                    )}

                    {fbConnected && (
                      <div className="space-y-3 pt-2 border-t">
                        <p className="text-xs font-medium text-muted-foreground">إعدادات البوت المتقدمة</p>
                        {[
                          { key: "botAutoReply" as const, label: "الرد التلقائي", icon: MessageCircle, desc: "يرد تلقائياً على استفسارات الزبائن ويعرض معلومات المنتج" },
                          { key: "botAutoCall" as const, label: "الاتصال التلقائي", icon: Phone, desc: "يتصل بالزبون لتأكيد الطلب والتأكد من جدية الشراء" },
                          { key: "botAutoReview" as const, label: "المراجعة التلقائية", icon: CheckCircle2, desc: "إذا كانت درجة الثقة عالية، يؤكد البوت الطلب وينشئه تلقائياً" },
                        ].map(({ key, label, icon: Icon, desc }) => (
                          <div key={key} className={cn("flex items-center justify-between rounded-lg border bg-card px-4 py-3", !form.fbIgEnabled && "opacity-60")}>
                            <div className="flex items-center gap-3">
                              <Icon className={cn("w-4 h-4", form.fbIgEnabled ? "text-primary" : "text-muted-foreground")} />
                              <div>
                                <p className="text-sm font-medium text-foreground">{label}</p>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
                              </div>
                            </div>
                            <Switch
                              checked={form[key]}
                              onCheckedChange={(c) => setForm(f => ({ ...f, [key]: c }))}
                              disabled={!form.fbIgEnabled}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Confirmation */}
              {formStep === 4 && (
                <Card className="border-t-4 border-t-accent">
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-foreground text-sm">مراجعة المنتج</span>
                    </div>

                    <div className="rounded-xl bg-muted/30 border p-5 space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Package className="w-4 h-4" />
                        <span className="font-semibold text-foreground">المعلومات الأساسية</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الاسم</span>
                        <span className="font-medium text-foreground">{form.name || "—"}</span>
                      </div>
                      {form.description && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الوصف</span>
                          <span className="text-foreground text-start max-w-[200px] truncate">{form.description}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التصنيف</span>
                        <span className="text-foreground">{form.category || "—"}</span>
                      </div>
                      {form.tags && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الوسوم</span>
                          <span className="text-foreground">{form.tags}</span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl bg-muted/30 border p-5 space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="font-semibold text-foreground">التسعير والمخزون</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">السعر</span>
                        <span className="font-bold text-foreground">{form.price ? `${Number(form.price).toFixed(2)} TND` : "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المخزون</span>
                        <span className="text-foreground">{form.stock || "0"}</span>
                      </div>
                      {form.variants.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">التنويعات</span>
                          <span className="text-foreground">{form.variants.length} تنويع</span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl bg-muted/30 border p-5 space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <ImageIcon className="w-4 h-4" />
                        <span className="font-semibold text-foreground">الصور</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">عدد الصور</span>
                        <span className="text-foreground">{form.imageUrls.length}</span>
                      </div>
                      {form.imageUrls.length > 0 && (
                        <div className="flex gap-2 mt-1">
                          {form.imageUrls.slice(0, 5).map((url, i) => (
                            <div key={i} className="w-10 h-10 rounded-md overflow-hidden border">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {form.imageUrls.length > 5 && (
                            <div className="w-10 h-10 rounded-md border flex items-center justify-center text-xs text-muted-foreground bg-muted">
                              +{form.imageUrls.length - 5}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {form.fbIgEnabled && (
                      <div className="rounded-xl bg-muted/30 border p-5 space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-semibold text-foreground">البوت</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">عرض في البوت</span>
                          <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">مفعل</Badge>
                        </div>
                        {form.fbProductLink && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">رابط فيسبوك</span>
                            <span className="text-xs text-foreground max-w-[200px] truncate dir-ltr">{form.fbProductLink}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex flex-col gap-2">
                          {[{ key: "botAutoReply" as const, label: "الرد التلقائي" }, { key: "botAutoCall" as const, label: "الاتصال التلقائي" }, { key: "botAutoReview" as const, label: "المراجعة التلقائية" }].map(({ key, label }) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{label}</span>
                              {form[key] ? <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">مفعل</Badge> : <span className="text-muted-foreground/40 text-[10px]">—</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Fixed Bottom Bar */}
          <div className="shrink-0 border-t bg-background shadow-[0_-2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.2)] px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                {formStep > 0 && (
                  <Button variant="outline" onClick={() => setFormStep(formStep - 1)} className="gap-1.5">
                    <ChevronRight className="w-4 h-4" />
                    السابق
                  </Button>
                )}
              </div>
              <div>
                {formStep < 4 ? (
                  <Button onClick={() => setFormStep(formStep + 1)} disabled={formStep === 0 && !form.name.trim()} className="gap-1.5">
                    التالي
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit as any}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {editingId ? "تأكيد التعديل" : "تأكيد وإنشاء المنتج"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bot Panel / Drawer */}
      {activeBotProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end rtl:justify-start animate-in fade-in duration-200" dir={dir}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setActiveBotProduct(null);
              setSelectedFakeConv(null);
            }}
          />

          {/* Drawer Body - 70% to 75% of screen width */}
          <div className="relative w-full lg:w-[75%] max-w-6xl bg-background shadow-2xl h-full flex flex-col border-s border-border animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10 relative">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <Bot className="w-5 h-5 text-accent animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
                <h3 className="font-bold text-base text-foreground">
                  قائمة المحادثات ({FAKE_CONVERSIONS.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-muted"
                onClick={() => {
                  setActiveBotProduct(null);
                  setSelectedFakeConv(null);
                }}
              >
                إغلاق
              </Button>
            </div>

            {/* Split Screen Grid */}
            <div className="flex-1 grid grid-cols-1 overflow-hidden h-full">
              {/* Right Column: Conversions List & Chat Window */}
              <div className="flex flex-col h-full overflow-hidden bg-card">
                {!selectedFakeConv ? (
                  /* Case A: Show Conversions / Customer List */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {FAKE_CONVERSIONS.map((conv) => (
                        <div
                          key={conv.id}
                          className="p-4 rounded-xl border border-border/80 bg-background shadow-xs hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group relative overflow-hidden"
                          onClick={() => { setSelectedFakeConv(conv); setSellerBotMessages([]); setExtraMessages([]); }}
                        >
                          <div className="absolute top-0 start-0 h-full w-1 bg-transparent group-hover:bg-accent transition-colors" />
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-bold text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                                {conv.customerName}
                                <span className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  conv.status === "cancelled" ? "bg-red-400" : "bg-emerald-400 animate-pulse"
                                )} />
                              </p>
                              <p className="text-xs text-muted-foreground font-mono" dir="ltr">{conv.phoneNumber}</p>
                            </div>
                            <div className="text-end space-y-1.5">
                              <span className={cn(
                                "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs",
                                conv.status === "confirmed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" :
                                conv.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" :
                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                              )}>
                                {conv.status === "confirmed" ? "مؤكد" : conv.status === "delivered" ? "تم التوصيل" : "ملغي"}
                              </span>
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-[10px] text-muted-foreground">الثقة:</span>
                                <span className={cn(
                                  "text-[11px] font-black",
                                  conv.trustScore >= 70 ? "text-green-600" : conv.trustScore >= 40 ? "text-amber-500" : "text-red-500"
                                )}>
                                  {conv.trustScore}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Last message quote */}
                          <div className="mt-3 pt-3 border-t border-dashed border-border flex items-center justify-between text-xs">
                            <p className="text-muted-foreground truncate italic flex-1 max-w-[280px] group-hover:text-foreground transition-colors">
                              💬 "{conv.lastMessage}"
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {new Date(conv.createdAt).toLocaleDateString("ar-TN")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Case B: Show Live Bot Conversation Logs */
                  <div className="flex-1 flex flex-col overflow-hidden h-full">
                    {/* Customer Chat Header */}
                    <div className="p-4 border-b border-border/50 bg-muted/15 flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFakeConv(null)}
                        className="gap-1 text-xs"
                      >
                        {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        رجوع للعملاء
                      </Button>
                      <div className="text-center">
                        <p className="font-bold text-sm text-foreground">{selectedFakeConv.customerName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{selectedFakeConv.phoneNumber}</p>
                      </div>
                      <div className="text-end">
                        <span className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          selectedFakeConv.status === "confirmed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200" :
                          selectedFakeConv.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                        )}>
                          {selectedFakeConv.status === "confirmed" ? "مؤكد" : selectedFakeConv.status === "delivered" ? "تم التوصيل" : "ملغي"}
                        </span>
                      </div>
                    </div>

                    {/* Chat Bubble History Container */}
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-5 bg-muted/10 space-y-4">
                      {selectedFakeConv.messages.map((m: any, i: number) => {
                        const isBot = m.role === "bot";
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex w-full items-start gap-2.5",
                              isBot ? "justify-start" : "justify-end"
                            )}
                          >
                            {isBot ? (
                              <>
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-xs">
                                  <Bot className="w-4 h-4 animate-pulse" />
                                </div>
                                {/* Bubble */}
                                <div className="max-w-[80%] space-y-1">
                                  <div
                                    className={cn(
                                      "p-3 rounded-2xl text-xs whitespace-pre-line shadow-xs leading-relaxed transition-all bg-background text-foreground border border-border",
                                      dir === "rtl" ? "rounded-tr-none" : "rounded-tl-none"
                                    )}
                                  >
                                    {m.text}
                                  </div>
                                  <p className="text-[9px] text-muted-foreground px-1 text-start">{m.time}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Bubble */}
                                <div className="max-w-[80%] space-y-1">
                                  <div
                                    className={cn(
                                      "p-3 rounded-2xl text-xs whitespace-pre-line shadow-xs leading-relaxed transition-all bg-primary text-primary-foreground hover:bg-primary/95",
                                      dir === "rtl" ? "rounded-tl-none" : "rounded-tr-none"
                                    )}
                                  >
                                    {m.text}
                                  </div>
                                  <p className="text-[9px] text-muted-foreground px-1 text-end">{m.time}</p>
                                </div>
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-black text-xs shrink-0 shadow-xs">
                                  {selectedFakeConv.customerName.slice(0, 2)}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}

                      {/* Extra bot messages after seller provided info */}
                      {extraMessages.map((m, i) => (
                        <div key={`extra-${i}`} className="flex w-full items-start gap-2.5 justify-start">
                          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-xs">
                            <Bot className="w-4 h-4 animate-pulse" />
                          </div>
                          <div className="max-w-[80%] space-y-1">
                            <div className="p-3 rounded-2xl text-xs whitespace-pre-line shadow-xs leading-relaxed transition-all bg-background text-foreground border border-border rounded-tl-none">
                              {m.text}
                            </div>
                            <p className="text-[9px] text-muted-foreground px-1 text-start">{m.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bot Asking + Seller Reply */}
                    <div className="border-t bg-background relative">
                      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

                      {/* Seller-Bot conversation thread */}
                      <div className="max-h-[180px] overflow-y-auto px-4 pt-3 pb-1 space-y-2">
                        {extraMessages.length === 0 && sellerBotMessages.length === 0 && selectedFakeConv && (
                          <div className="flex items-start gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                              <Bot className="w-3 h-3" />
                            </div>
                            <div className="text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl rounded-tl-none border border-border/50 leading-relaxed max-w-[85%]">
                              المشتري يسأل: {selectedFakeConv.lastMessage}
                            </div>
                          </div>
                        )}
                        {sellerBotMessages.map((msg, i) => (
                          <div key={i} className={cn("flex items-start gap-2.5", msg.role === "seller" && "flex-row-reverse")}>
                            {msg.role === "bot" ? (
                              <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                                <Bot className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] shrink-0 mt-0.5">
                                {activeBotProduct?.name?.charAt(0) || "أ"}
                              </div>
                            )}
                            <div className={cn(
                              "text-[11px] p-2.5 rounded-xl leading-relaxed max-w-[85%]",
                              msg.role === "bot"
                                ? "text-muted-foreground bg-muted/30 rounded-tl-none border border-border/50"
                                : "bg-primary/10 text-foreground rounded-tr-none border border-primary/20"
                            )}>
                              {msg.text}
                            </div>
                          </div>
                      ))}
                    </div>

                      {/* Seller reply input */}
                      <div className="p-3 pt-2 flex items-end gap-2 border-t border-border/30">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-9 w-9 shrink-0 rounded-lg border-dashed"
                          title="إرفاق صورة"
                        >
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <div className="relative flex-1">
                          <Input
                            value={sellerInput}
                            onChange={e => setSellerInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter" && sellerInput.trim()) {
                                setSellerBotMessages(prev => [...prev, { role: "seller", text: sellerInput.trim() }]);
                                setTimeout(() => {
                                  setSellerBotMessages(prev => [...prev, { role: "bot", text: `شكراً على المعلومة! تم إفادة المشتري بها.` }]);
                                  setExtraMessages(prev => [...prev, { role: "bot", text: `شكراً لمشاركتك المعلومة! سأقوم بإفادة المشتري بها فوراً. 🙏`, time: new Date().toLocaleTimeString("ar-TN", { hour: "2-digit", minute: "2-digit" }) }]);
                                }, 500);
                                setSellerInput("");
                              }
                            }}
                            placeholder="زوّد البوت بالمعلومة المطلوبة..."
                            className="text-xs ps-3 h-9 border-border/80"
                          />
                        </div>
                        <Button size="sm" className="text-xs h-9 px-3 gap-1 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
                          onClick={() => {
                            if (sellerInput.trim()) {
                              setSellerBotMessages(prev => [...prev, { role: "seller", text: sellerInput.trim() }]);
                              setTimeout(() => {
                                setSellerBotMessages(prev => [...prev, { role: "bot", text: `شكراً على المعلومة! تم إفادة المشتري بها.` }]);
                                setExtraMessages(prev => [...prev, { role: "bot", text: `شكراً لمشاركتك المعلومة! سأقوم بإفادة المشتري بها فوراً. 🙏`, time: new Date().toLocaleTimeString("ar-TN", { hour: "2-digit", minute: "2-digit" }) }]);
                              }, 500);
                              setSellerInput("");
                            }
                          }}
                        >
                          <Send className="w-3.5 h-3.5" />
                          إرسال
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
